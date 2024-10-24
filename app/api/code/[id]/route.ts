import {NextResponse} from "next/server";
import * as codeTemplateService from "@server/services/codeTemplates";
import * as tagService from "@server/services/tags"
import {DatabaseIntegrityException, InvalidCredentialsException, ServiceException} from "@server/types/exceptions";

export async function GET(req: Request, {params}: { params: { id: string } }) {
    try {
        if (!Number(params.id)) {
            return NextResponse.json(
                {message: "Invalid id"},
                {status: 400}
            );
        }

        const codeTemplateId = parseInt(params.id, 10)

        const codeTemplate = await codeTemplateService.getCodeTemplateById(codeTemplateId)
        const newTags = await tagService.getTagNamesByIds(codeTemplate.tagIds)
        return NextResponse.json(
            {
                message: "Code template fetched successfully",
                codeTemplate: {
                    id: codeTemplate.id,
                    userId: codeTemplate.userId,
                    title: codeTemplate.title,
                    code: codeTemplate.code,
                    language: codeTemplate.language,
                    explanation: codeTemplate.explanation,
                    tags: newTags,
                },
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

export async function PUT(req: Request, {params}: { params: { id: string } }) {
    try {
        if (!Number(params.id)) {
            return NextResponse.json(
                {message: "Invalid id"},
                {status: 400}
            );
        }

        const codeTemplateId = parseInt(params.id, 10)

        const {
            title,
            code,
            language,
            explanation,
            tags
        } = await req.json()
        const updateCodeTemplateRequest = {
            id: codeTemplateId,
            title,
            code,
            language,
            explanation,
            tags
        }

        const updatedCodeTemplate = await codeTemplateService.updateCodeTemplate(updateCodeTemplateRequest)
        const newTags = await tagService.getTagNamesByIds(updatedCodeTemplate.tagIds)
        return NextResponse.json(
            {
                message: "Code template updated successfully",
                codeTemplate: {
                    id: updatedCodeTemplate.id,
                    userId: updatedCodeTemplate.userId,
                    title: updatedCodeTemplate.title,
                    code: updatedCodeTemplate.code,
                    language: updatedCodeTemplate.language,
                    explanation: updatedCodeTemplate.explanation,
                    tags: newTags,
                },
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