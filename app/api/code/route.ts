import {NextResponse} from "next/server";
import * as codeTemplateService from "@server/services/codeTemplates";
import {
    DatabaseIntegrityException,
    InsufficientPermissionsException,
    InvalidCredentialsException,
    ServiceException
} from "@server/types/exceptions";
import * as authorizationService from "@server/services/authorization";
import {GetCodeTemplatesRequest} from "@server/types/dtos/codeTemplates";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);

        const page = url.searchParams.get('page') ? parseInt(url.searchParams.get('page')!) : undefined;
        const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;
        const userId = url.searchParams.get('userId') ? parseInt(url.searchParams.get('userId')!, 10) : undefined;
        const title = url.searchParams.get('title') || undefined;
        const content = url.searchParams.get('content') || undefined;
        const tags = url.searchParams.get('tags') ? url.searchParams.get('tags')!.split(',') : undefined;

        if (userId) {
            await authorizationService.verifyMatchingUserAuthorization(req, userId);
        }

        const getCodeTemplatesRequest  = {
            title,
            userId,
            tags,
            content,
            page,
            limit,
        } as GetCodeTemplatesRequest;

        const { totalCount, codeTemplates } = await codeTemplateService.getCodeTemplatesByUserId(getCodeTemplatesRequest);

        return NextResponse.json(
            {
                message: "Code templates fetched successfully",
                codeTemplates,
                totalCount,
            },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof DatabaseIntegrityException) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        } else if (error instanceof InvalidCredentialsException) {
            return NextResponse.json({ error: error.message }, { status: 401 });
        } else if (error instanceof ServiceException) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        } else if (error instanceof InsufficientPermissionsException) {
            return NextResponse.json({ error: error.message }, { status: 403 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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
                    tags: createdCodeTemplate.tags,
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