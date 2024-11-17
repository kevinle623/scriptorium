import {NextResponse} from "next/server";
import * as blogPostService from "@server/services/blogPosts";
import * as authorizationService from "@server/services/authorization";
import {BlogPost, BlogPostOrderType} from "@/types/dtos/blogPosts";
import {routeHandlerException} from "@server/utils/exceptionUtils";
import {verifyBasicAuthorization} from "@server/services/authorization";

export async function GET(req: Request) {
    try {
        const userId = await authorizationService.extractUserIdFromRequestHeader(req)

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
            userId
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
        return routeHandlerException(error)
    }
}

export async function POST(req: Request) {
    try {
        const {
            title,
            description,
            content,
            codeTemplateIds = [],
            tags = [],
        } = await req.json();

        const { userId } = await verifyBasicAuthorization(req);

        const cleanedCodeTemplateIds = Array.isArray(codeTemplateIds)
            ? codeTemplateIds
                .map((id) => Number(id))
                .filter((id) => !isNaN(id))
            : [];

        const createBlogPostRequest = {
            title,
            description,
            content,
            userId: Number(userId),
            codeTemplateIds: cleanedCodeTemplateIds,
            tags,
        };

        const blogPost: BlogPost = await blogPostService.createBlogPost(createBlogPostRequest);
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
            { status: 201 }
        );
    } catch (error) {
        return routeHandlerException(error);
    }
}
