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
            content,
        } = await req.json()

        await authorizationService.verifyMatchingUserAuthorization(req, userId)

        const comment =  await commentService.addCommentToComment(commentId, userId, content)
        return NextResponse.json(
            {
                message: "Comment successfully replied",
                comment: {
                    id: comment.id,
                    userId: comment.userId,
                    parentId: comment.parentId,
                    content: comment.content,
                }
            },
            {status: 201}
        );
    } catch (error) {
        return routeHandlerException(error)
    }
}

export async function GET(req: Request, {params}: { params: { id: string } }) {
    try {
        const userId = await authorizationService.extractUserIdFromRequestHeader(req)
        if (!Number(params.id)) {
            return NextResponse.json(
                {message: "Invalid id"},
                {status: 400}
            );
        }

        const commentId = parseInt(params.id, 10)

        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get("page") || "1", 10);
        const limit = parseInt(url.searchParams.get("limit") || "10", 10);

        const { comments, totalCount } = await commentService.getDirectRepliesFromComment(commentId, page, limit, userId)

        return NextResponse.json(
            {
                message: "Comment direct replies fetched successfully",
                comments: comments,
                totalCount: totalCount,
            },
            {status: 201}
        );
    } catch (error) {
        return routeHandlerException(error)
    }
}