import {NextResponse} from "next/server";
import * as codeTemplateService from "@server/services/codeTemplates";
import * as tagService from "@server/services/tags";
import {DatabaseIntegrityException, InvalidCredentialsException, ServiceException} from "@server/types/exceptions";
import * as authorizationService from "@server/services/authorization";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const page = url.searchParams.get('page') ? parseInt(url.searchParams.get('page')!) : undefined;
        const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;
        const userId = url.searchParams.get('userId') ? parseInt(url.searchParams.get('userId')!) : undefined;

        if (!userId) {
            throw new InvalidCredentialsException("User id is not valid")
        }

        const {totalCount, codeTemplates} = await codeTemplateService.getCodeTemplatesByUserId(userId, page, limit)

        const codeTemplatesWithTags = await Promise.all(
            codeTemplates.map(async (codeTemplatePost) => {
                const tags = await tagService.getTagNamesByIds(codeTemplatePost.tagIds);
                return {
                    id: codeTemplatePost.id,
                    userId: codeTemplatePost.userId,
                    title: codeTemplatePost.title,
                    language: codeTemplatePost.language,
                    code: codeTemplatePost.code,
                    parentTemplateId: codeTemplatePost.parentTemplateId,
                    tags: tags,
                    createdAt: codeTemplatePost.createdAt,
                    updatedAt: codeTemplatePost.updatedAt,
                };
            })
        );

        return NextResponse.json(
            {
                message: "Blog Posts fetched successfully",
                codeTemplates: codeTemplatesWithTags,
                totalCount: totalCount,
            },
            {status: 201}
        );
    } catch (error) {
        if (error instanceof DatabaseIntegrityException) {
            return NextResponse.json({error: error.message}, {status: 400});
        } else if (error instanceof InvalidCredentialsException) {
            return NextResponse.json({error: error.message}, {status: 401});
        } else if (error instanceof ServiceException) {
            return NextResponse.json({error: error.message}, {status: 400});
        }
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}

export async function POST(req: Request) {
    try {
        const createCodeTemplateRequest = await req.json();

        if (!createCodeTemplateRequest.userId || !createCodeTemplateRequest.title || !createCodeTemplateRequest.language || !createCodeTemplateRequest.code) {
            return NextResponse.json(
                {message: "Missing required fields"},
                {status: 400}
            );
        }

        await authorizationService.verifyMatchingUserAuthorization(req, createCodeTemplateRequest.userId)

        const createdCodeTemplate = await codeTemplateService.createCodeTemplate(createCodeTemplateRequest);

        const tags = await tagService.getTagNamesByIds(createdCodeTemplate.tagIds);

        return NextResponse.json(
            {
                message: "Code Template created successfully",
                codeTemplate: {
                    id: createdCodeTemplate.id,
                    userId: createdCodeTemplate.userId,
                    title: createdCodeTemplate.title,
                    language: createdCodeTemplate.language,
                    code: createdCodeTemplate.code,
                    parentTemplateId: createdCodeTemplate.parentTemplateId,
                    tags: tags,
                    createdAt: createdCodeTemplate.createdAt,
                    updatedAt: createdCodeTemplate.updatedAt,
                }
            },
            {status: 201}
        );
    } catch (error) {
        if (error instanceof DatabaseIntegrityException) {
            return NextResponse.json({error: error.message}, {status: 400});
        } else if (error instanceof InvalidCredentialsException) {
            return NextResponse.json({error: error.message}, {status: 401});
        } else if (error instanceof ServiceException) {
            return NextResponse.json({error: error.message}, {status: 400});
        }
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}