export const dynamic = 'force-dynamic';
import * as commentService from "@server/services/comments";
import {NextResponse} from "next/server";
import * as authorizationService from "@server/services/authorization";
import {routeHandlerException} from "@server/utils/exceptionUtils";

export async function GET(req: Request) {
    try {
        await authorizationService.verifyAdminAuthorization(req)
        const url = new URL(req.url);
        const page = url.searchParams.get('page') ? parseInt(url.searchParams.get('page')!) : undefined;
        const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;
        const {comments, totalCount} = await commentService.getMostReportedComments(page, limit)
        return NextResponse.json(
            {
                message: "Most reported comments fetched successfully",
                comments: comments,
                totalCount: totalCount,
            },
            {status: 201}
        );
    } catch (error) {
        return routeHandlerException(error)
    }
}