import {NextResponse} from "next/server";
import * as codeTemplateService from "@server/services/codeTemplates";
import * as authorizationService from "@server/services/authorization";
import {GetCodeTemplatesRequest} from "@/types/dtos/codeTemplates";
import {routeHandlerException} from "@server/utils/exceptionUtils";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const userId = await authorizationService.extractUserIdFromRequestHeader(req)

        const page = url.searchParams.get('page') ? parseInt(url.searchParams.get('page')!) : undefined;
        const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;
        const title = url.searchParams.get('title') || undefined;
        const content = url.searchParams.get('content') || undefined;
        const tags = url.searchParams.get('tags') ? url.searchParams.get('tags')!.split(',') : undefined;
        const ids = url.searchParams.get('ids') ? url.searchParams.get('ids')!.split(',').map(Number) : undefined;
        const mineOnly = url.searchParams.get('mineOnly') === 'true';

        const getCodeTemplatesRequest  = {
            title,
            userId,
            tags,
            content,
            page,
            limit,
            ids,
            mineOnly: userId ? mineOnly : false
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
        return routeHandlerException(error)
    }
}

export async function POST(req: Request) {
    try {
        let createCodeTemplateRequest = await req.json();

        if (!createCodeTemplateRequest.title || !createCodeTemplateRequest.language || !createCodeTemplateRequest.code) {
            return NextResponse.json(
                {message: "Missing required fields"},
                {status: 400}
            );
        }

        const { userId } = await authorizationService.verifyBasicAuthorization(req)

        createCodeTemplateRequest = {
            ...createCodeTemplateRequest,
            userId
        }

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
        return routeHandlerException(error)
    }
}