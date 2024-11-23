import {NextResponse} from "next/server";
import * as blogPostService from "@server/services/blogPosts";
import * as authorizationService from "@server/services/authorization";
import {BlogPost} from "@/types/dtos/blogPosts";
import {routeHandlerException} from "@server/utils/exceptionUtils";

export async function GET(req: Request, {params}: { params: { id: string } }) {
    try {
        if (!Number(params.id)) {
            return NextResponse.json(
                {message: "Invalid id"},
                {status: 400}
            );
        }

        const blogPostId = parseInt(params.id, 10)

        const blogPost = await blogPostService.getBlogPostById(blogPostId)

        if (blogPost.hidden) {
            await authorizationService.verifyMatchingUserAuthorization(req, blogPost.userId)
        }

        return NextResponse.json(
            {
                message: "Blog Post fetched successfully",
                blogPost: {
                    id: blogPost.id,
                    userId: blogPost.userId,
                    title: blogPost.title,
                    description: blogPost.description,
                    content: blogPost.content,
                    hidden: blogPost.hidden,
                    codeTemplateIds: blogPost.codeTemplateIds,
                    createdAt: blogPost.createdAt,
                    updatedAt: blogPost.updatedAt,
                    upVotes: blogPost.upVotes,
                    downVotes: blogPost.downVotes,
                    tags: blogPost.tags,
                    commentIds: blogPost.commentIds,
                },
            },
            {status: 201}
        );
    } catch (error) {
        return routeHandlerException(error)
    }
}

export async function PUT(req: Request, {params}: { params: { id: string } }) {
    try {
        if (!Number(params.id)) {
            return NextResponse.json(
                {message: "Invalid id"},
                {status: 400}
            );
        }

        const blogPostId = parseInt(params.id, 10)

        const currentBlogPost = await blogPostService.getBlogPostById(blogPostId)

        await authorizationService.verifyMatchingUserAuthorization(req, currentBlogPost.userId)

        const {
            title,
            description,
            content,
            codeTemplateIds,
            tags
        } = await req.json()

        const editBlogPostRequest = {
            blogPostId,
            title,
            description,
            content,
            codeTemplateIds,
            tags,
        }

        const blogPost: BlogPost = await blogPostService.updateBlogPost(editBlogPostRequest)
        return NextResponse.json(
            {
                message: "Blog Post updated successfully",
                blogPost: {
                    id: blogPost.id,
                    userId: blogPost.userId,
                    title: blogPost.title,
                    description: blogPost.description,
                    content: blogPost.content,
                    hidden: blogPost.hidden,
                    codeTemplateIds: blogPost.codeTemplateIds,
                    createdAt: blogPost.createdAt,
                    updatedAt: blogPost.updatedAt,
                    tags: blogPost.tags,
                    commentIds: blogPost.commentIds,
                },
            },
            {status: 201}
        );
    } catch (error) {
        routeHandlerException(error)
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

        const blogPostId = parseInt(params.id, 10);

        const blogPost = await blogPostService.getBlogPostById(blogPostId)

        await authorizationService.verifyMatchingUserAuthorization(req, blogPost.userId)

        await blogPostService.deleteBlogPost(blogPostId);

        return NextResponse.json(
            {message: "Blog Post deleted successfully"},
            {status: 200}
        );
    } catch (error) {
        return routeHandlerException(error)
    }
}