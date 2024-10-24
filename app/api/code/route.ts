import {NextResponse} from "next/server";
import * as codeTemplateService from "@server/services/codeTemplates";
import * as tagService from "@server/services/tags";
import {DatabaseIntegrityException, InvalidCredentialsException, ServiceException} from "@server/types/exceptions";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const page = url.searchParams.get('page') ? parseInt(url.searchParams.get('page')!) : undefined;
        const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;
        const userId = url.searchParams.get('userId') ? parseInt(url.searchParams.get('userId')!) : undefined;

        if (!userId) {
            throw new InvalidCredentialsException("User id is not valid")
        }

        const codeTemplates = await codeTemplateService.getCodeTemplatesByUserId(userId, page, limit)

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