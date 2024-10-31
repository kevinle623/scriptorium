import {NextResponse} from "next/server";
import * as commentService from "@server/services/comments";
import {DatabaseIntegrityException, InvalidCredentialsException, ServiceException} from "@server/types/exceptions";
import * as authorizationService from "@server/services/authorization";

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
        if (error instanceof DatabaseIntegrityException) {
            return NextResponse.json({error: error.message}, {status: 400});
        } else if (error instanceof InvalidCredentialsException) {
            return NextResponse.json({error: error.message}, {status: 401});
        } else if (error instanceof ServiceException) {
            return NextResponse.json({error: error.message}, {status: 400});
        }
        console.log("error")
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}