import * as codeExecutionLibrary from "@server/libs/codeExecution";
import {
    CodeTemplate,
    CodingLanguage,
    CreateCodeTemplateRequest, GetCodeTemplatesResult,
    UpdateCodeTemplateRequest
} from "@server/types/dtos/codeTemplates";
import * as codeTemplateRepository from "@server/repositories/codeTemplates"
import * as tagRepository from "@server/repositories/tags"

import {prisma} from "@server/libs/prisma/client";
import {NotFoundException} from "@server/types/exceptions";

export async function createCodeTemplate(createCodeTemplateRequest: CreateCodeTemplateRequest) {
    try {
        const codeTemplate = await prisma.$transaction(async (prismaTx) => {
            const newCodeTemplate = await codeTemplateRepository.createCodeTemplate(prismaTx, createCodeTemplateRequest);
            if (createCodeTemplateRequest.tags && createCodeTemplateRequest.tags.length > 0) {
                await tagRepository.createCodeTemplateTags(prismaTx, newCodeTemplate.id, createCodeTemplateRequest.tags);
            }
            return newCodeTemplate;
        });

        const updatedCodeTemplate = await codeTemplateRepository.getCodeTemplateById(prisma, codeTemplate.id);

        if (!updatedCodeTemplate) {
            throw new NotFoundException("Code template not found.")
        }

        return updatedCodeTemplate;
    } catch(e) {
        throw e;
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
        const updatedCodeTemplate = await prisma.$transaction(async (prismaTx) => {
            await codeTemplateRepository.editCodeTemplate(prismaTx, updateCodeTemplateRequest);

            if (updateCodeTemplateRequest.tags && updateCodeTemplateRequest.tags.length > 0) {
                await tagRepository.updateCodeTemplateTags(prismaTx, updateCodeTemplateRequest.id, updateCodeTemplateRequest.tags);
            }

            const updatedTemplate = await codeTemplateRepository.getCodeTemplateById(prismaTx, updateCodeTemplateRequest.id);
            if (!updatedTemplate) {
                throw new NotFoundException("Code Template Not Found");
            }
            return updatedTemplate;
        });

        return updatedCodeTemplate;
    } catch (error) {
        throw error;
    }
}

export async function getCodeTemplatesByUserId(
    userId: number,
    page?: number,
    limit?: number,
): Promise<GetCodeTemplatesResult> {
    try {
        return await codeTemplateRepository.getCodeTemplatesByUserId(prisma, userId, page, limit)
    } catch (e) {
        throw e
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