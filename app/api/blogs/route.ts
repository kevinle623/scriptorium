import {NextResponse} from "next/server";
import * as blogPostService from "@server/services/blogPosts";
import * as tagService from "@server/services/tags";
import {DatabaseIntegrityException, InvalidCredentialsException, ServiceException} from "@server/types/exceptions";
import * as authorizationService from "@server/services/authorization";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const page = url.searchParams.get('page') ? parseInt(url.searchParams.get('page')!) : undefined;
        const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;
        const tagsList = url.searchParams.get('tagsList') ? url.searchParams.get('tagsList')!.split(',') : undefined;
        const sortBy = url.searchParams.get('sortBy') || undefined;
        const sortOrd = url.searchParams.get('sortOrd') || undefined;

        const getBlogPostRequest = {
            page,
            limit,
            tagsList,
            sortBy,
            sortOrd,
        };

        const {totalCount, blogPosts} = await blogPostService.getBlogPosts(getBlogPostRequest);

        const blogPostsWithTags = await Promise.all(
            blogPosts.map(async (blogPost) => {
                const tags = await tagService.getTagNamesByIds(blogPost.tagIds);
                return {
                    id: blogPost.id,
                    userId: blogPost.userId,
                    title: blogPost.title,
                    description: blogPost.description,
                    content: blogPost.content,
                    hidden: blogPost.hidden,
                    codeTemplateIds: blogPost.codeTemplateIds,
                    createdAt: blogPost.createdAt,
                    updatedAt: blogPost.updatedAt,
                    tags: tags,
                    commentIds: blogPost.commentIds,
                    upVotes: blogPost.upVotes,
                    downVotes: blogPost.downVotes,
                };
            })
        );

        return NextResponse.json(
            {
                message: "Blog Posts fetched successfully",
                blogPosts: blogPostsWithTags,
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
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}

export async function POST(req: Request) {
    try {
        const {
            title,
            description,
            content,
            userId,
            codeTemplateIds,
            tags
        } = await req.json()

        const createBlogPostRequest = {
            title,
            description,
            content,
            userId,
            codeTemplateIds,
            tags,
        }

        await authorizationService.verifyMatchingUserAuthorization(req, userId)

        const blogPost = await blogPostService.createBlogPost(createBlogPostRequest)
        const tagNames = await tagService.getTagNamesByIds(blogPost.tagIds)
        return NextResponse.json(
            {
                message: "Blog Post created successfully",
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
                    tags: tagNames,
                    commentIds: blogPost.commentIds,
                },
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