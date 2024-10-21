import {DatabaseIntegrityException} from "@server/types/exceptions";
import {BlogPost as BlogPostModel} from "@prisma/client"
import {BlogPost, CreateBlogPostRequest} from "@server/types/dtos/blogPosts";

export async function createBlogPost(prismaClient, createBlogPostRequest: CreateBlogPostRequest): Promise<BlogPost> {
    try {
        const blogPost = await prismaClient.BlogPost.create({
            data: {
                title: createBlogPostRequest.title,
                description: createBlogPostRequest.description,
                content: createBlogPostRequest.content,
                userId: createBlogPostRequest.userId,
                codeTemplates: {
                    create: createBlogPostRequest.codeTemplateIds.map((id) => ({
                        codeTemplate: {
                            connect: { id },
                        },
                    })),
                },
            }
        })
        return deserializeBlogPost(blogPost)
    } catch (error) {
        console.error("Database Error", error)
        throw new DatabaseIntegrityException('Database error: Failed to create blog post');
    }
}

export async function getBlogPostById(prismaClient, blogPostId) {
    try {
        const blogPost = await prismaClient.BlogPost.findUnique({
            where: {
                id: blogPostId,
            }
        })
        return deserializeBlogPost(blogPost)
    } catch (error) {
        console.error("Database Error", error)
        throw new DatabaseIntegrityException('Database error: Failed to fetch blog post by id');

    }
}

function deserializeBlogPost(blogPost: BlogPostModel): BlogPost {
    return {
        id: blogPost.id,
        title: blogPost.title,
        description: blogPost.description,
        content: blogPost.content,
        userId: blogPost.userId,
        hidden: blogPost.hidden,
        createdAt: blogPost.createdAt,
        updatedAt: blogPost.updatedAt,
        codeTemplateIds: blogPost.codeTemplates.map((template) => template.codeTemplateId),
    };
}
