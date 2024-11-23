import {NextResponse} from "next/server";
import * as commentService from "@server/services/comments";
import * as authorizationService from "@server/services/authorization";
import {routeHandlerException} from "@server/utils/exceptionUtils";

export async function PUT(req: Request, {params}: { params: { id: string } }) {
    try {
        if (!Number(params.id)) {
            return NextResponse.json(
                {message: "Invalid id"},
                {status: 400}
            );
        }

        const commentId = parseInt(params.id, 10)

        const {
            content
        } = await req.json()

        const currentComment = await commentService.getCommentById(commentId)
        await authorizationService.verifyMatchingUserAuthorization(req, currentComment.userId)

        const comment = await commentService.updateComment(commentId, content)
        return NextResponse.json(
            {
                message: "Comment updated successfully",
                comment: {
                    id: comment.id,
                    userId: comment.userId,
                    content: comment.content,
                },
            },
            {status: 201}
        );
    } catch (error) {
        return routeHandlerException(error)
    }
}

export async function DELETE(req: Request, {params}: { params: { id: string } }) {
    try {
        if (!Number(params.id)) {
            return NextResponse.json(
                {message: "Invalid id"},
                {status: 400}
            );
        }

        const commentId = parseInt(params.id, 10)

        await commentService.removeComment(commentId)
        return NextResponse.json(
            {
                message: "Comment deleted successfully",
            },
            {status: 201}
        );
    } catch (error) {
        return routeHandlerException(error)
    }
}

export async function GET(req: Request, {params}: { params: { id: string } }) {
    try {
        if (!Number(params.id)) {
            return NextResponse.json(
                {message: "Invalid id"},
                {status: 400}
            );
        }

        const commentId = parseInt(params.id, 10)

        const comment = await commentService.getCommentById(commentId)

        if (comment.hidden) {
            await authorizationService.verifyMatchingUserAuthorization(req, comment.userId)
        }
        return NextResponse.json(
            {
                message: "Comment fetched successfully",
                comment: {
                    id: comment.id,
                    content: comment.content,
                    userId: comment.userId,
                    blogPostId: comment.blogPostId,
                    parentId: comment.parentId,
                    createdAt: comment.createdAt,
                    hidden: comment.hidden,
                    replyIds: comment.replyIds,
                    upVotes: comment.upVotes,
                    downVotes: comment.downVotes,
                    reportIds: comment.reportIds,
                }
            },
            {status: 201}
        );
    } catch (error) {
        return routeHandlerException(error)
    }
}