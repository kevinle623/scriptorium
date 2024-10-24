import {DatabaseIntegrityException, InvalidCredentialsException, ServiceException} from "@server/types/exceptions";
import * as blogPostService from "@server/services/blogPosts";
import * as tagService from "@server/services/tags";
import {NextResponse} from "next/server";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const page = url.searchParams.get('page') ? parseInt(url.searchParams.get('page')!) : undefined;
        const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;

        const blogPosts = await blogPostService.getMostReportedBlogPosts(page, limit)
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
                message: "Most reported blog posts fetched successfully",
                blogPosts: blogPostsWithTags,
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