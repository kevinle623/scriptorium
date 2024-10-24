import {CodeTemplate as CodeTemplateModel} from "@prisma/client";
import {CodeTemplate, CreateCodeTemplateRequest, UpdateCodeTemplateRequest} from "@server/types/dtos/codeTemplates"
import {DatabaseIntegrityException} from "@server/types/exceptions";


export async function createCodeTemplate(prismaClient, createCodeTemplateRequest: CreateCodeTemplateRequest) {
    try {
        const newCodeTemplate = await prismaClient.codeTemplate.create({
            data: {
                title: createCodeTemplateRequest.title,
                userId: createCodeTemplateRequest.userId,
                code: createCodeTemplateRequest.code,
                explanation: createCodeTemplateRequest.explaination,
                language: createCodeTemplateRequest.language,
                parentTemplateId: createCodeTemplateRequest.parentTemplateId || null,
            },
        });
        return deserializeCodeTemplate(newCodeTemplate);
    } catch (e) {
        console.error("Database error: ", e);
        throw new DatabaseIntegrityException("Database error: failed to create code template");
    }
}
export async function getCodeTemplateById(
    prismaClient,
    codeTemplateId: number
): Promise<CodeTemplate | null> {
    try {
        const codeTemplate = await prismaClient.codeTemplate.findUnique({
            where: { id: codeTemplateId },
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
                user: true,
            },
        });

        if (!codeTemplate) {
            return null;
        }
        return deserializeCodeTemplate(codeTemplate);
    } catch (e) {
        console.error("Database error: ", e);
        throw new DatabaseIntegrityException("Database error: failed to fetch code template by id");
    }
}
export async function editCodeTemplate(
    prismaClient,
    updateCodeTemplateRequest: UpdateCodeTemplateRequest
): Promise<CodeTemplate> {
    try {
        const dataToUpdate: Record<string, any> = {};

        if (updateCodeTemplateRequest.title !== undefined) {
            dataToUpdate.title = updateCodeTemplateRequest.title;
        }

        if (updateCodeTemplateRequest.code !== undefined) {
            dataToUpdate.code = updateCodeTemplateRequest.code;
        }

        if (updateCodeTemplateRequest.explanation !== undefined) {
            dataToUpdate.explanation = updateCodeTemplateRequest.explanation;
        }

        if (updateCodeTemplateRequest.language !== undefined) {
            dataToUpdate.language = updateCodeTemplateRequest.language;
        }

        const updatedTemplate = await prismaClient.codeTemplate.update({
            where: { id: updateCodeTemplateRequest.id },
            data: dataToUpdate,
        });

        return deserializeCodeTemplate(updatedTemplate);
    } catch (e) {
        console.error("Database error: ", e);
        throw new DatabaseIntegrityException("Database error: failed to update code template");
    }
}


function deserializeCodeTemplate(templateModel: CodeTemplateModel): CodeTemplate {
    return {
        id: templateModel.id,
        title: templateModel.title,
        code: templateModel.code,
        language: templateModel.language,
        explanation: templateModel.explanation,
        parentTemplateId: templateModel.parentTemplateId,
        userId: templateModel.userId,
        tagIds: templateModel.tags.map((tag) => tag.tagId),
        createdAt: templateModel.createdAt,
        updatedAt: templateModel.updatedAt,
    };
}