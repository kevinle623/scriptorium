import * as commentService from "@server/services/comments";
import {NextResponse} from "next/server";
import * as authorizationService from "@server/services/authorization";
import {routeHandlerException} from "@server/utils/exception_utils";

export async function GET(req: Request) {
    try {
        await authorizationService.verifyAdminAuthorization(req)
        const url = new URL(req.url);
        const page = url.searchParams.get('page') ? parseInt(url.searchParams.get('page')!) : undefined;
        const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;
        const comments = await commentService.getMostReportedComments(page, limit)
        return NextResponse.json(
            {
                message: "Most reported comments fetched successfully",
                comments: comments,
            },
            {status: 201}
        );
    } catch (error) {
        routeHandlerException(error)
    }
}