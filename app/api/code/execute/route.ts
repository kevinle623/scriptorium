import {NextResponse} from "next/server";
import * as codeTemplateService from "@server/services/codeTemplates";
import {
    CodeExecutionException,
} from "@server/types/exceptions";
import {routeHandlerException} from "@server/utils/exception_utils";

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
                message: "Code executed successfully",
                result: result
            },
            {status: 201}
        );
    } catch (error) {
        if (error instanceof CodeExecutionException) {
            return NextResponse.json(
                {error: error.message},
                {status: 400}
            );
        } else {
            return routeHandlerException(error)
        }
    }
}