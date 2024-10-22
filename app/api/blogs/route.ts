import {NextResponse} from "next/server";
import * as blogPostService from "@server/services/blogPosts";
import * as tagService from "@server/services/tags";
import {DatabaseIntegrityException, InvalidCredentialsException, ServiceException} from "@server/types/exceptions";

export async function GET(req: Request) {
    try {
        const {page, limit, tagsList, sortBy, sortOrd} = await req.json();

        const getBlogPostRequest = {
            page,
            limit,
            tagsList,
            sortBy,
            sortOrd,
        };

        const blogPosts = await blogPostService.getBlogPosts(getBlogPostRequest);

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

// export async function POST(req: Request) {
//     try {
//         const {
//             title,
//             description,
//             content,
//             userId,
//             codeTemplateIds,
//             tags
//         } = await req.json()
//         const blogPost = await blogPostService.createBlogPost()
//         const tags = await tagService.getTagNamesByIds(blogPost.tagIds)
//         return NextResponse.json(
//             {
//                 message: "Blog Post fetched successfully",
//                 blogPost: {
//                     id: blogPost.id,
//                     userId: blogPost.userId,
//                     title: blogPost.title,
//                     description: blogPost.description,
//                     content: blogPost.content,
//                     hidden: blogPost.hidden,
//                     codeTemplateIds: blogPost.codeTemplateIds,
//                     createdAt: blogPost.createdAt,
//                     updatedAt: blogPost.updatedAt,
//                     tags: tags,
//                     commentIds: blogPost.commentIds,
//                 },
//             },
//             {status: 201}
//         );
//     } catch (error) {
//         if (error instanceof DatabaseIntegrityException) {
//             return NextResponse.json({error: error.message}, {status: 400});
//         } else if (error instanceof InvalidCredentialsException) {
//             return NextResponse.json({error: error.message}, {status: 401});
//         } else if (error instanceof ServiceException) {
//             return NextResponse.json({error: error.message}, {status: 400});
//         }
//         return NextResponse.json({error: "Internal server error"}, {status: 500});
//     }
// }