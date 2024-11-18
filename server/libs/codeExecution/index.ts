import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { CodingLanguage } from "@/types/dtos/codeTemplates";
import { CodeExecutionException } from "@/types/exceptions";

const MAX_CODE_EXECUTION_TIMEOUT = 5000;
const MAX_RECURSION_DEPTH = 1000;

/**
 * Main function to execute user-provided code.
 */
export async function runCode(
    language: CodingLanguage,
    code: string,
    stdin?: string
): Promise<string> {
    let filePath = '';
    let stdinFilePath: string | undefined = undefined;

    try {
        // Add recursion limit for Python
        if (language === CodingLanguage.PYTHON) {
            code = `import sys\nsys.setrecursionlimit(${MAX_RECURSION_DEPTH})\n` + code;
        }

        // Create temporary files for code and stdin
        filePath = await createTempFile(language, code);
        stdinFilePath = stdin ? await createTempStdinFile(stdin) : undefined;

        // Execute code inside a Docker container
        return await executeCodeWithDocker(language, filePath, stdinFilePath);
    } catch (error) {
        console.error(error);
        throw new CodeExecutionException(`Code execution error: ${error.message || error}`);
    } finally {
        // Clean up temporary files
        if (filePath) await fs.unlink(filePath).catch(console.error);
        if (stdinFilePath) await fs.unlink(stdinFilePath).catch(console.error);
    }
}

/**
 * Create a temporary file for the user-provided code.
 */
async function createTempFile(language: CodingLanguage, code: string): Promise<string> {
    const extension = getFileExtension(language);
    const fileName = `temp_${Date.now()}.${extension}`;
    const filePath = path.join('/tmp', fileName);

    // Adjust class name for Java
    if (language === CodingLanguage.JAVA) {
        code = code.replace(/public\s+class\s+(\w+)/, `public class ${fileName.replace(`.${extension}`, '')}`);
    }

    await fs.writeFile(filePath, code);
    return filePath;
}

/**
 * Create a temporary file for the user-provided stdin.
 */
async function createTempStdinFile(stdin: string): Promise<string> {
    const fileName = `temp_stdin_${Date.now()}.txt`;
    const filePath = path.join('/tmp', fileName);

    await fs.writeFile(filePath, stdin);
    return filePath;
}

/**
 * Get the file extension for a given programming language.
 */
function getFileExtension(language: CodingLanguage): string {
    switch (language.toLowerCase()) {
        case CodingLanguage.C: return 'c';
        case CodingLanguage.CPLUSPLUS: return 'cpp';
        case CodingLanguage.JAVA: return 'java';
        case CodingLanguage.PYTHON: return 'py';
        case CodingLanguage.JAVASCRIPT: return 'js';
        case CodingLanguage.RUBY: return 'rb';
        case CodingLanguage.GO: return 'go';
        case CodingLanguage.PHP: return 'php';
        case CodingLanguage.SWIFT: return 'swift';
        case CodingLanguage.KOTLIN: return 'kt';
        case CodingLanguage.RUST: return 'rs';
        default:
            throw new CodeExecutionException('Unsupported language');
    }
}

/**
 * Get the Docker image name for a given programming language.
 */
function getDockerImageName(language: CodingLanguage): string {
    switch (language.toLowerCase()) {
        case CodingLanguage.C:
        case CodingLanguage.CPLUSPLUS: return 'gcc:latest';
        case CodingLanguage.JAVA: return 'openjdk:latest';
        case CodingLanguage.PYTHON: return 'python:3.9-slim';
        case CodingLanguage.JAVASCRIPT: return 'node:16';
        case CodingLanguage.RUBY: return 'ruby:latest';
        case CodingLanguage.GO: return 'golang:latest';
        case CodingLanguage.PHP: return 'php:latest';
        case CodingLanguage.SWIFT: return 'swift:latest';
        case CodingLanguage.KOTLIN: return 'openjdk:latest';
        case CodingLanguage.RUST: return 'rust:latest';
        default:
            throw new CodeExecutionException('Unsupported language');
    }
}

/**
 * Build the Docker command to execute the code.
 */
function buildDockerCommand(
    language: CodingLanguage,
    dockerImage: string,
    filePath: string,
    stdinFilePath?: string
): string {
    const codeFileName = path.basename(filePath);
    const stdinMount = stdinFilePath ? `-v ${stdinFilePath}:/sandbox/stdin.txt` : '';
    const stdinRedirect = stdinFilePath ? `</sandbox/stdin.txt` : '';

    return `docker run --rm -v ${filePath}:/sandbox/${codeFileName} ${stdinMount} ${dockerImage} ${getExecutionCommand(language, codeFileName, stdinRedirect)}`;
}

/**
 * Get the execution command for a given programming language.
 */
function getExecutionCommand(language: CodingLanguage, fileName: string, stdinRedirect: string): string {
    switch (language.toLowerCase()) {
        case CodingLanguage.C:
            return `sh -c "gcc /sandbox/${fileName} -o /sandbox/a.out && /sandbox/a.out ${stdinRedirect}"`;
        case CodingLanguage.CPLUSPLUS:
            return `sh -c "g++ /sandbox/${fileName} -o /sandbox/a.out && /sandbox/a.out ${stdinRedirect}"`;
        case CodingLanguage.JAVA:
            const className = path.basename(fileName, '.java');
            return `sh -c "javac /sandbox/${fileName} && java -cp /sandbox ${className} ${stdinRedirect}"`;
        case CodingLanguage.PYTHON:
            return `python3 /sandbox/${fileName} ${stdinRedirect}`;
        case CodingLanguage.JAVASCRIPT:
            return `node /sandbox/${fileName} ${stdinRedirect}`;
        case CodingLanguage.RUBY:
            return `ruby /sandbox/${fileName} ${stdinRedirect}`;
        case CodingLanguage.GO:
            return `sh -c "go run /sandbox/${fileName} ${stdinRedirect}"`;
        case CodingLanguage.PHP:
            return `php /sandbox/${fileName} ${stdinRedirect}`;
        case CodingLanguage.SWIFT:
            return `swift /sandbox/${fileName} ${stdinRedirect}`;
        case CodingLanguage.KOTLIN:
            return `sh -c "kotlinc /sandbox/${fileName} -include-runtime -d /sandbox/program.jar && java -jar /sandbox/program.jar ${stdinRedirect}"`;
        case CodingLanguage.RUST:
            return `sh -c "rustc /sandbox/${fileName} -o /sandbox/a.out && /sandbox/a.out ${stdinRedirect}"`;
        default:
            throw new CodeExecutionException('Unsupported language');
    }
}

/**
 * Execute a Docker command and return the result.
 */
async function runWithExec(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(command, { timeout: MAX_CODE_EXECUTION_TIMEOUT }, (error, stdout, stderr) => {
            if (error) {
                reject(new CodeExecutionException(`Error executing code: ${stderr || error.message}`));
            } else if (stderr) {
                reject(new CodeExecutionException(`Execution error: ${stderr}`));
            } else {
                resolve(stdout.trim());
            }
        });
    });
}

/**
 * Execute code within a Docker container.
 */
async function executeCodeWithDocker(
    language: CodingLanguage,
    filePath: string,
    stdinFilePath?: string
): Promise<string> {
    const dockerImage = getDockerImageName(language);
    const dockerCommand = buildDockerCommand(language, dockerImage, filePath, stdinFilePath);

    return await runWithExec(dockerCommand);
}
