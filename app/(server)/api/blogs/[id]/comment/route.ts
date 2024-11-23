import {NextResponse} from "next/server";
import * as blogPostService from "@server/services/blogPosts";
import {
    DatabaseIntegrityException,
    InsufficientPermissionsException,
    InvalidCredentialsException, NotFoundException,
    ServiceException
} from "@/types/exceptions";
import * as authorizationService from "@server/services/authorization";
import {routeHandlerException} from "@server/utils/exceptionUtils";

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
            content,
        } = await req.json()

        const { userId } = await authorizationService.verifyBasicAuthorization(req)

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
        routeHandlerException(error)
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
        return routeHandlerException(error)
    }
}