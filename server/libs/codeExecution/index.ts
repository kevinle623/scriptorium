import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { CodingLanguage } from "@server/types/dtos/codeTemplates";
import { CodeExecutionException } from "@server/types/exceptions";

const MAX_CODE_EXECUTION_TIMEOUT = 5000;

export async function runCode(
    language: CodingLanguage,
    code: string,
    stdin?: string
): Promise<string> {
    try {
        const filePath = await createTempFile(language, code);
        let stdinFilePath: string | undefined = undefined;

        if (stdin) {
            stdinFilePath = await createTempStdinFile(stdin);
        }

        const stdout = await executeCode(language, filePath, stdinFilePath);

        await fs.unlink(filePath);
        if (stdinFilePath) {
            await fs.unlink(stdinFilePath);
        }

        return stdout;
    } catch (error) {
        throw new CodeExecutionException(`Error executing code: ${error.message}`);
    }
}

async function createTempFile(language: CodingLanguage, code: string): Promise<string> {
    const extension = getFileExtension(language);
    const fileName = `temp_${Date.now()}.${extension}`;
    const filePath = path.join('/tmp', fileName);
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
        case CodingLanguage.C:
            return 'c';
        case CodingLanguage.CPLUSPLUS:
            return 'cpp';
        case CodingLanguage.JAVA:
            return 'java';
        case CodingLanguage.PYTHON:
            return 'py';
        case CodingLanguage.JAVASCRIPT:
            return 'js';
        default:
            throw new CodeExecutionException('Unsupported language');
    }
}

async function executeCode(
    language: CodingLanguage,
    filePath: string,
    stdinFilePath?: string
): Promise<string> {
    const execCommand = getExecCommand(language, filePath, stdinFilePath);
    return await runWithExec(execCommand);
}

function getExecCommand(language: CodingLanguage, filePath: string, stdinFilePath?: string): string {
    const stdinRedirect = stdinFilePath ? `< ${stdinFilePath}` : '';

    switch (language.toLowerCase()) {
        case CodingLanguage.C:
            return `gcc ${filePath} -o ${filePath}.out && ${filePath}.out ${stdinRedirect}`;
        case CodingLanguage.CPLUSPLUS:
            return `g++ ${filePath} -o ${filePath}.out && ${filePath}.out ${stdinRedirect}`;
        case CodingLanguage.JAVA:
            return `javac ${filePath} && java ${filePath.replace('.java', '')} ${stdinRedirect}`;
        case CodingLanguage.PYTHON:
            return `python3 ${filePath} ${stdinRedirect}`;
        case CodingLanguage.JAVASCRIPT:
            return `node ${filePath} ${stdinRedirect}`;
        default:
            throw new CodeExecutionException('Unsupported language');
    }
}

async function runWithExec(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(command, { timeout: MAX_CODE_EXECUTION_TIMEOUT }, (error, stdout, stderr) => {
            if (error) {
                reject(new CodeExecutionException(`Error executing code: ${stderr || error.message}`));
            } else {
                resolve(stdout);
            }
        });
    });
}
