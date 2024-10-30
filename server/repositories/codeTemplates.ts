import {CodeTemplate as CodeTemplateModel, PrismaClient} from "@prisma/client";
import {
    CodeTemplate, CodingLanguage,
    CreateCodeTemplateRequest,
    GetCodeTemplatesResult,
    UpdateCodeTemplateRequest
} from "@server/types/dtos/codeTemplates"
import {DatabaseIntegrityException} from "@server/types/exceptions";


export async function createCodeTemplate(prismaClient: any, createCodeTemplateRequest: CreateCodeTemplateRequest) {
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
        }) as CodeTemplateModel;
        return deserializeCodeTemplate(newCodeTemplate);
    } catch (e) {
        console.error("Database error: ", e);
        throw new DatabaseIntegrityException("Database error: failed to create code template");
    }
}

export async function getCodeTemplateById(
    prismaClient: any,
    codeTemplateId: number
): Promise<CodeTemplate | null> {
    try {
        const codeTemplate = await prismaClient.codeTemplate.findUnique({
            where: {id: codeTemplateId},
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
                user: true,
            },
        }) as CodeTemplateModel;

        if (!codeTemplate) {
            return null;
        }
        return deserializeCodeTemplate(codeTemplate);
    } catch (e) {
        console.error("Database error: ", e);
        throw new DatabaseIntegrityException("Database error: failed to fetch code template by id");
    }
}

export async function getCodeTemplatesByUserId(
    prismaClient: any,
    userId: number,
    page?: number,
    limit?: number
): Promise<GetCodeTemplatesResult> {
    try {
        const skip = page && limit ? (page - 1) * limit : undefined;
        const take = limit ?? undefined;

        const totalCount = await prismaClient.codeTemplate.count({
            where: { userId: userId },
        });

        const codeTemplates = await prismaClient.codeTemplate.findMany({
            where: { userId: userId },
            skip: skip,
            take: take
        });

        return {
            codeTemplates: codeTemplates.map((codeTemplate: CodeTemplateModel) => deserializeCodeTemplate(codeTemplate)),
            totalCount
        };
    } catch (e) {
        console.error("Database error: ", e);
        throw new DatabaseIntegrityException("Database error: failed to fetch code templates by user id");
    }
}


export async function editCodeTemplate(
    prismaClient: any,
    updateCodeTemplateRequest: UpdateCodeTemplateRequest
): Promise<void> {
    try {
        await prismaClient.codeTemplate.update({
            where: {id: updateCodeTemplateRequest.id},
            data: {
                ...(updateCodeTemplateRequest.title && {title: updateCodeTemplateRequest.title}),
                ...(updateCodeTemplateRequest.code && {code: updateCodeTemplateRequest.code}),
                ...(updateCodeTemplateRequest.explanation && {explanation: updateCodeTemplateRequest.explanation}),
                ...(updateCodeTemplateRequest.language && {language: updateCodeTemplateRequest.language}),
            },
        });

        return
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
        language: (templateModel.language as CodingLanguage),
        explanation: (templateModel.explanation || undefined),
        parentTemplateId: (templateModel.parentTemplateId || undefined),
        userId: templateModel.userId,
        createdAt: templateModel.createdAt,
        updatedAt: templateModel.updatedAt,
    };
}