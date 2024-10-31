import {NextResponse} from "next/server";
import * as commentService from "@server/services/comments"
import * as authorizationService from "@server/services/authorization";
import {routeHandlerException} from "@server/utils/exception_utils";

export async function PUT(req: Request, {params}: { params: { id: string } }) {
    try {
        await authorizationService.verifyAdminAuthorization(req)
        if (!Number(params.id)) {
            return NextResponse.json(
                {message: "Invalid id"},
                {status: 400}
            );
        }

        const commentId = parseInt(params.id, 10)

        const {
            hidden,
        } = await req.json()

        await commentService.toggleHiddentComment(commentId, hidden)
        return NextResponse.json(
            {
                message: "Comment hidden status has been updated",
                commentId: commentId,
                hidden: hidden,
            },
            {status: 201}
        );
    } catch (error) {
        routeHandlerException(error)
    }
}