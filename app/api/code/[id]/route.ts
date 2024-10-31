import {NextResponse} from "next/server";
import * as codeTemplateService from "@server/services/codeTemplates";
import * as tagService from "@server/services/tags"
import {DatabaseIntegrityException, InvalidCredentialsException, ServiceException} from "@server/types/exceptions";
import * as authorizationService from "@server/services/authorization";

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
                    tags: codeTemplate.tags,
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

        const currentCodeTemplate = await codeTemplateService.getCodeTemplateById(codeTemplateId)
        await authorizationService.verifyMatchingUserAuthorization(req, currentCodeTemplate.userId)

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
                    tags: updatedCodeTemplate.tags,
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