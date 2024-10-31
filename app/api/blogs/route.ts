import {NextResponse} from "next/server";
import * as blogPostService from "@server/services/blogPosts";
import {
    DatabaseIntegrityException,
    InsufficientPermissionsException,
    InvalidCredentialsException,
    ServiceException
} from "@server/types/exceptions";
import * as authorizationService from "@server/services/authorization";
import {BlogPost, BlogPostOrderType} from "@server/types/dtos/blogPosts";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);

        const page = url.searchParams.get('page') ? parseInt(url.searchParams.get('page')!) : undefined;
        const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;

        const title = url.searchParams.get('title') || undefined;
        const content = url.searchParams.get('content') || undefined;

        const codeTemplateIds = url.searchParams.getAll('codeTemplateIds').length > 0
            ? url.searchParams.getAll('codeTemplateIds').flatMap(ids => ids.split(',').map(id => parseInt(id, 10)))
            : undefined;

        const tagsList = url.searchParams.getAll('tags').length > 0
            ? url.searchParams.getAll('tags').flatMap(tags => tags.split(','))
            : undefined;

        const orderBy = url.searchParams.get('orderBy') || undefined;

        let parsedOrderBy = orderBy
        if (parsedOrderBy === 'mostReported') {
            parsedOrderBy = undefined
        }

        const getBlogPostRequest = {
            page,
            limit,
            title,
            content,
            codeTemplateIds,
            tagsList,
            orderBy: parsedOrderBy as BlogPostOrderType,
        };

        const {totalCount, blogPosts} = await blogPostService.getBlogPosts(getBlogPostRequest);

        return NextResponse.json(
            {
                message: "Blog Posts fetched successfully",
                blogPosts: blogPosts,
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

        const blogPost: BlogPost = await blogPostService.createBlogPost(createBlogPostRequest)
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
                    tags: blogPost.tags,
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
        } else if (error instanceof InsufficientPermissionsException) {
            return NextResponse.json({error: error.message}, {status: 401});
        }
        console.log("bruh", error)
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}