import {NextResponse} from "next/server";
import * as commentService from "@server/services/comments";
import * as authorizationService from "@server/services/authorization";
import {routeHandlerException} from "@server/utils/exception_utils";

export async function POST(req: Request, {params}: { params: { id: string } }) {
    try {
        if (!Number(params.id)) {
            return NextResponse.json(
                {message: "Invalid id"},
                {status: 400}
            );
        }

        const commentId = parseInt(params.id, 10)

        const {
            userId,
            reason,
        } = await req.json()

        await authorizationService.verifyMatchingUserAuthorization(req, userId)

        const report =  await commentService.reportComment(userId, commentId, reason)
        return NextResponse.json(
            {
                message: "Comment successfully reported",
                report: {
                    id: report.id,
                    userId: report.userId,
                    commentId: report.commentId,
                    reason: report.reason,
                }
            },
            {status: 201}
        );
    } catch (error) {
        routeHandlerException(error)
    }
}