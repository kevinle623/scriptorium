import * as codeExecutionLibrary from "@server/libs/codeExecution/codeExecution";
import {CodingLanguage} from "@server/types/dtos/codeTemplates";

export async function executeCodeSnippet(
    language: CodingLanguage,
    code: string,
    stdin?: string
): Promise<string> {
    try {
        const result = await codeExecutionLibrary.runCode(language, code, stdin);
        return result;
    } catch (error) {
        throw error
    }
}