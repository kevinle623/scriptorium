import * as codeExecutionLibrary from "@server/libs/codeExecution";
import {
    CodeTemplate,
    CodingLanguage,
    CreateCodeTemplateRequest, GetCodeTemplatesRequest, GetCodeTemplatesResult,
    UpdateCodeTemplateRequest
} from "@/types/dtos/codeTemplates";
import * as codeTemplateRepository from "@server/repositories/codeTemplates"
import * as tagRepository from "@server/repositories/tags"

import {prisma} from "@server/libs/prisma/client";
import {NotFoundException} from "@/types/exceptions";

async function populateCodeTemplate(codeTemplate: CodeTemplate): Promise<CodeTemplate> {
    const codeTemplateId = codeTemplate.id
    codeTemplate.tags = await tagRepository.getTagNamesByCodeTemplateId(prisma, codeTemplateId)
    return codeTemplate
}

export async function createCodeTemplate(createCodeTemplateRequest: CreateCodeTemplateRequest): Promise<CodeTemplate> {
    try {
        const codeTemplate = await prisma.$transaction(async (prismaTx) => {
            const newCodeTemplate = await codeTemplateRepository.createCodeTemplate(prismaTx, createCodeTemplateRequest);
            if (createCodeTemplateRequest.tags && createCodeTemplateRequest.tags.length > 0) {
                await tagRepository.createCodeTemplateTags(prismaTx, newCodeTemplate.id, createCodeTemplateRequest.tags);
            }
            return newCodeTemplate;
        });
        return await populateCodeTemplate(codeTemplate);
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
        return await populateCodeTemplate(codeTemplate)
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
        return await populateCodeTemplate(updatedCodeTemplate);
    } catch (error) {
        throw error;
    }
}

export async function getCodeTemplatesByUserId(
    getCodeTemplatesRequest: GetCodeTemplatesRequest
): Promise<GetCodeTemplatesResult> {
    try {
        const { totalCount, codeTemplates } = await codeTemplateRepository.getCodeTemplatesByUserId(prisma, getCodeTemplatesRequest);

        const populatedCodeTemplates = await Promise.all(
            codeTemplates.map(async (codeTemplate) => await populateCodeTemplate(codeTemplate))
        );

        return { totalCount, codeTemplates: populatedCodeTemplates };
    } catch (e) {
        throw e
    }
}

export async function deleteCodeTemplateById(
    codeTemplateId: number
): Promise<void> {
    try {
        await prisma.$transaction(async (prismaTx) => {
            const existingCodeTemplate = await codeTemplateRepository.getCodeTemplateById(prismaTx, codeTemplateId);
            if (!existingCodeTemplate) {
                throw new NotFoundException("Code template does not exist");
            }
            await codeTemplateRepository.deleteCodeTemplateRelationsByCodeTemplateId(prismaTx, codeTemplateId);
            await tagRepository.deleteCodeTemplateTags(prismaTx, codeTemplateId);
            await codeTemplateRepository.deleteCodeTemplateById(prismaTx, codeTemplateId);
        });
        return
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