import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { CodingLanguage } from "@/types/dtos/codeTemplates";
import { CodeExecutionException } from "@/types/exceptions";

const MAX_CODE_EXECUTION_TIMEOUT = 6000;
const DOCKER_CODE_EXECUTION_TIMEOUT = 4000;
const MAX_RECURSION_DEPTH = 1000;

export async function runCode(
    language: CodingLanguage,
    code: string,
    stdin?: string
): Promise<string> {
    let filePath = '';
    let stdinFilePath: string | undefined = undefined;

    try {
        if (language === CodingLanguage.PYTHON) {
            code = `import sys\nsys.setrecursionlimit(${MAX_RECURSION_DEPTH})\n` + code;
        }

        filePath = await createTempFile(language, code);
        stdinFilePath = stdin ? await createTempStdinFile(stdin) : undefined;

        return await executeCodeWithDocker(language, filePath, stdinFilePath);
    } catch (error) {
        console.error(error);
        throw new CodeExecutionException(
            `Code execution error: ${(error as Error).message || error}`
        );
    } finally {
        if (filePath) await fs.unlink(filePath).catch(console.error);
        if (stdinFilePath) await fs.unlink(stdinFilePath).catch(console.error);
    }
}

async function createTempFile(language: CodingLanguage, code: string): Promise<string> {
    const extension = getFileExtension(language);
    const fileName = `temp_${Date.now()}.${extension}`;
    const filePath = path.join('/tmp', fileName);

    if (language === CodingLanguage.JAVA) {
        code = code.replace(/public\s+class\s+(\w+)/, `public class ${fileName.replace(`.${extension}`, '')}`);
    }

    await fs.writeFile(filePath, code);
    return filePath;
}

async function createTempStdinFile(stdin: string): Promise<string> {
    const fileName = `temp_stdin_${Date.now()}.txt`;
    const filePath = path.join('/tmp', fileName);

    await fs.writeFile(filePath, stdin);
    return filePath;
}

function getFileExtension(language: CodingLanguage): string {
    switch (language.toLowerCase()) {
        case CodingLanguage.C: return 'c';
        case CodingLanguage.CPLUSPLUS: return 'cpp';
        case CodingLanguage.JAVA: return 'java';
        case CodingLanguage.PYTHON: return 'py';
        case CodingLanguage.JAVASCRIPT: return 'js';
        case CodingLanguage.RUBY: return 'rb';
        case CodingLanguage.PERL: return 'pl';
        case CodingLanguage.PHP: return 'php';
        case CodingLanguage.SWIFT: return 'swift';
        case CodingLanguage.RUST: return 'rs';
        default:
            throw new CodeExecutionException('Unsupported language');
    }
}

function getDockerImageName(language: CodingLanguage): string {
    switch (language.toLowerCase()) {
        case CodingLanguage.C: return 'language-runner-c';
        case CodingLanguage.CPLUSPLUS: return 'language-runner-cpp';
        case CodingLanguage.JAVA: return 'language-runner-java';
        case CodingLanguage.PYTHON: return 'language-runner-python';
        case CodingLanguage.JAVASCRIPT: return 'language-runner-node';
        case CodingLanguage.RUBY: return 'language-runner-ruby';
        case CodingLanguage.PERL: return 'language-runner-perl';
        case CodingLanguage.PHP: return 'language-runner-php';
        case CodingLanguage.SWIFT: return 'language-runner-swift';
        case CodingLanguage.RUST: return 'language-runner-rust';
        default:
            throw new CodeExecutionException('Unsupported language');
    }
}

function buildDockerCommand(
    language: CodingLanguage,
    dockerImage: string,
    filePath: string,
    stdinFilePath?: string
): string {
    const codeFileName = path.basename(filePath);
    const resolvedStdinFilePath = stdinFilePath ? path.resolve(stdinFilePath) : null;
    const stdinMount = resolvedStdinFilePath ? `-v ${resolvedStdinFilePath}:/sandbox/stdin.txt` : '';
    const stdinRedirect = resolvedStdinFilePath ? `< /sandbox/stdin.txt` : '';

    const dockerOptions = [
        '--rm',
        '--memory="256m"',
        '--cpus="1"',
        '--pids-limit=50',
        '--network=none',
    ].join(' ');

    const timeoutSeconds = Math.floor(DOCKER_CODE_EXECUTION_TIMEOUT / 1000);
    const dockerTimeoutCommand = `timeout ${timeoutSeconds}s`;
    return `docker run ${dockerOptions} -v ${filePath}:/sandbox/${codeFileName} ${stdinMount} ${dockerImage} ${dockerTimeoutCommand} ${getExecutionCommand(language, codeFileName, stdinRedirect)}`;
}

function getExecutionCommand(language: CodingLanguage, fileName: string, stdinRedirect: string): string {
    console.log("file name", fileName)
    switch (language.toLowerCase()) {
        case CodingLanguage.C:
            return `sh -c "gcc /sandbox/${fileName} -o /sandbox/a.out && /sandbox/a.out ${stdinRedirect}"`;
        case CodingLanguage.CPLUSPLUS:
            return `sh -c "g++ /sandbox/${fileName} -o /sandbox/a.out && /sandbox/a.out ${stdinRedirect}"`;
        case CodingLanguage.JAVA:
            const className = path.basename(fileName, '.java');
            return `sh -c "javac /sandbox/${fileName} && java -cp /sandbox ${className} ${stdinRedirect}"`;
        case CodingLanguage.PYTHON:
            return `sh -c "python3 /sandbox/${fileName} ${stdinRedirect}"`;
        case CodingLanguage.JAVASCRIPT:
            return `sh -c "node /sandbox/${fileName} ${stdinRedirect}"`;
        case CodingLanguage.RUBY:
            return `sh -c "ruby /sandbox/${fileName} ${stdinRedirect}"`;
        case CodingLanguage.PERL:
            return `sh -c "perl /sandbox/${fileName} ${stdinRedirect}"`;
        case CodingLanguage.PHP:
            return `sh -c "php /sandbox/${fileName} ${stdinRedirect}"`;
        case CodingLanguage.SWIFT:
            return `sh -c "swift /sandbox/${fileName} ${stdinRedirect}"`;
        case CodingLanguage.RUST:
            return `sh -c "rustc /sandbox/${fileName} -o /sandbox/a.out && /sandbox/a.out ${stdinRedirect}"`;
        default:
            throw new CodeExecutionException('Unsupported language');
    }
}

async function runWithExec(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(command, { timeout: MAX_CODE_EXECUTION_TIMEOUT }, (error, stdout, stderr) => {
            if (error) {
                if (error.killed) {
                    reject(new CodeExecutionException(`Execution was killed due to timeout`));
                } else {
                    reject(new CodeExecutionException(`Error executing code: ${stderr || error.message}`));
                }
                return;
            }
            if (stderr) {
                reject(new CodeExecutionException(`Execution error: ${stderr}`));
                return;
            }
            resolve(stdout.trim());
        });
    });
}


async function executeCodeWithDocker(
    language: CodingLanguage,
    filePath: string,
    stdinFilePath?: string
): Promise<string> {
    const dockerImage = getDockerImageName(language);
    const dockerCommand = buildDockerCommand(language, dockerImage, filePath, stdinFilePath);

    return await runWithExec(dockerCommand);
}
