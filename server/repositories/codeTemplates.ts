import {CodeTemplate as CodeTemplateModel} from "@prisma/client";
import {CodeTemplate, UpdateCodeTemplateRequest} from "@server/types/dtos/codeTemplates"
import {DatabaseIntegrityException} from "@server/types/exceptions";


export async function editCodeTemplate(
    prismaClient,
    codeTemplateId: number,
    updateCodeTemplateRequest: UpdateCodeTemplateRequest
): Promise<CodeTemplate> {
    try {
        const updatedTemplate = await prismaClient.codeTemplate.update({
            where: { id: codeTemplateId },
            data: {
                title: updateCodeTemplateRequest.title ?? undefined,
                code: updateCodeTemplateRequest.code ?? undefined,
                explanation: updateCodeTemplateRequest.explanation ?? undefined,
                language: updateCodeTemplateRequest.language ?? undefined,
                tags: updateCodeTemplateRequest.tagIds
                    ? {
                        set: [],
                        create: updateCodeTemplateRequest.tagIds.map((id) => ({
                            tag: {
                                connect: { id },
                            },
                        })),
                    }
                    : undefined,
            },
        });
        return deserializeCodeTemplate(updatedTemplate);
    } catch (e) {
        console.error("Database error: ", e);
        throw new DatabaseIntegrityException("Database error: failed to update code template");
    }
}

export async function forkCodeTemplate(
    prismaClient,
    userId: number,
    forkedTemplateId: number,
    title: string,
    code: string,
    explanation?: string
): Promise<CodeTemplate> {
    try {
        const originalTemplate = await prismaClient.codeTemplate.findUnique({
            where: { id: forkedTemplateId },
            include: {
                tags: true,
            },
        });

        if (!originalTemplate) {
            throw new DatabaseIntegrityException("Original template not found");
        }

        const newTemplate = await prismaClient.codeTemplate.create({
            data: {
                title,
                code,
                explanation: explanation || null,
                userId,
                language: originalTemplate.language,
                parentTemplateId: forkedTemplateId,
                tags: {
                    create: originalTemplate.tags.map((tag) => ({
                        tag: {
                            connect: { id: tag.tagId },
                        },
                    })),
                },
            },
        });

        return deserializeCodeTemplate(newTemplate);
    } catch (e) {
        console.error("Database error: ", e);
        throw new DatabaseIntegrityException("Database error: failed to fork code template");
    }
}


function deserializeCodeTemplate(templateModel: CodeTemplateModel): CodeTemplate {
    return {
        id: templateModel.id,
        title: templateModel.title,
        code: templateModel.code,
        language: templateModel.language,
        explanation: templateModel.explanation,
        userId: templateModel.userId,
        tagIds: templateModel.tags.map((tag) => tag.tagId),
        createdAt: templateModel.createdAt,
        updatedAt: templateModel.updatedAt,
    };
}