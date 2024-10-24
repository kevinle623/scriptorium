import {NextResponse} from "next/server";
import * as codeTemplateService from "@server/services/codeTemplates";
import {DatabaseIntegrityException, InvalidCredentialsException, ServiceException} from "@server/types/exceptions";

export async function POST(req: Request) {
    try {
        const {
            language,
            code,
            stdin,
        } = await req.json()

        const result =  await codeTemplateService.executeCodeSnippet(language, code, stdin)
        return NextResponse.json(
            {
                message: "Comment executed successfully",
                result: result
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