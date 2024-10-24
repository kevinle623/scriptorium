import {NextResponse} from "next/server";
import * as blogPostService from "@server/services/blogPosts";
import {DatabaseIntegrityException, InvalidCredentialsException, ServiceException} from "@server/types/exceptions";

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

        const comment =  await blogPostService.addCommentToBlogPost(blogPostId, userId, content)
        return NextResponse.json(
            {
                message: "Blog Post successfully commented",
                comment: {
                    id: comment.id,
                    userId: comment.userId,
                    blogPostId: comment.blogPostId,
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
        if (!Number(params.id)) {
            return NextResponse.json(
                {message: "Invalid id"},
                {status: 400}
            );
        }

        const blogPostId = parseInt(params.id, 10)

        const {page, limit} = await req.json();

        const comments = await blogPostService.getDirectCommentsFromBlogPost(blogPostId, page, limit)

        return NextResponse.json(
            {
                message: "Blog Post direct comments fetched successfully",
                comments: comments,
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