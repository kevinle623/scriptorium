import * as codeExecutionLibrary from "@server/libs/codeExecution";
import {
    CodeTemplate,
    CodingLanguage,
    CreateCodeTemplateRequest,
    UpdateCodeTemplateRequest
} from "@server/types/dtos/codeTemplates";
import * as codeTemplateRepository from "@server/repositories/codeTemplates"
import * as tagRepository from "@server/repositories/tags"

import {prisma} from "@server/libs/prisma/client";
import {NotFoundException} from "@server/types/exceptions";

export async function createCodeTemplate(createCodeTemplateRequest: CreateCodeTemplateRequest) {
    try {
        const codeTemplate = await codeTemplateRepository.createCodeTemplate(prisma, createCodeTemplateRequest)
        await tagRepository.createCodeTemplateTags(prisma, codeTemplate.id, createCodeTemplateRequest.tags)
        const updatedCodeTemplate = await codeTemplateRepository.getCodeTemplateById(prisma, codeTemplate.id)
        return updatedCodeTemplate
    } catch(e) {
        throw e
    }

}

export async function getCodeTemplateById(codeTemplateId: number): Promise<CodeTemplate> {
    try {
        const codeTemplate = await codeTemplateRepository.getCodeTemplateById(prisma, codeTemplateId)
        if (!codeTemplate) {
            throw new NotFoundException("Code Template Not Found")
        }
        return codeTemplate
    } catch (e) {
        throw e
    }
}
export async function updateCodeTemplate(updateCodeTemplateRequest: UpdateCodeTemplateRequest): Promise<CodeTemplate> {
    try {
        await codeTemplateRepository.editCodeTemplate(prisma, updateCodeTemplateRequest)
        if (updateCodeTemplateRequest.tags) {
            await tagRepository.updateCodeTemplateTags(prisma, updateCodeTemplateRequest.id, updateCodeTemplateRequest.tags)
        }
        const updatedCodeTemplate = await codeTemplateRepository.getCodeTemplateById(prisma, updateCodeTemplateRequest.id)
        if (!updatedCodeTemplate) {
            throw new NotFoundException("Code Template Not Found")
        }
        return updatedCodeTemplate
    } catch (error) {
        throw error
    }

}
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