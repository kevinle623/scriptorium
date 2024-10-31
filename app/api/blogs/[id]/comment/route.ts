import {NextResponse} from "next/server";
import * as blogPostService from "@server/services/blogPosts";
import {
    DatabaseIntegrityException,
    InsufficientPermissionsException,
    InvalidCredentialsException, NotFoundException,
    ServiceException
} from "@server/types/exceptions";
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

        const blogPostId = parseInt(params.id, 10)

        const {
            userId,
            content,
        } = await req.json()

        await authorizationService.verifyMatchingUserAuthorization(req, userId)

        const comment =  await blogPostService.addCommentToBlogPost(blogPostId, userId, content)
        return NextResponse.json(
            {
                message: "Blog Post successfully commented on",
                comment: {
                    id: comment.id,
                    userId: comment.userId,
                    blogPostId: comment.blogPostId,
                    content: comment.content,
                    createdAt: comment.createdAt
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
        } else if (error instanceof InsufficientPermissionsException) {
            return NextResponse.json({error: error.message}, {status: 403});
        } else if (error instanceof NotFoundException) {
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

        const blogPostId = parseInt(params.id, 10)

        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get("page") || "1", 10);
        const limit = parseInt(url.searchParams.get("limit") || "10", 10);

        const {totalCount, comments} = await blogPostService.getDirectCommentsFromBlogPost(blogPostId, page, limit, userId)

        return NextResponse.json(
            {
                message: "Blog Post direct comments fetched successfully",
                comments: comments,
                totalCount: totalCount,
            },
            {status: 201}
        );
    } catch (error) {
        routeHandlerException(error)
    }
}