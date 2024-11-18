export const dynamic = 'force-dynamic';
import * as commentService from "@server/services/comments";
import {NextResponse} from "next/server";
import * as authorizationService from "@server/services/authorization";
import {routeHandlerException} from "@server/utils/exceptionUtils";
import {GetCommentsRequest} from "@types/dtos/comments";

export async function GET(req: Request) {
    try {
        await authorizationService.verifyAdminAuthorization(req)
        const url = new URL(req.url);
        const page = url.searchParams.get('page') ? parseInt(url.searchParams.get('page')!) : undefined;
        const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;
        const hiddenParam = url.searchParams.get('hidden');
        const hidden = hiddenParam === 'true' ? true : hiddenParam === 'false' ? false : undefined;

        const getCommentsRequest = {
            page,
            limit,
            hidden,
            orderBy: 'mostReported'
        } as GetCommentsRequest

        const {comments, totalCount} = await commentService.getMostReportedComments(getCommentsRequest)
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