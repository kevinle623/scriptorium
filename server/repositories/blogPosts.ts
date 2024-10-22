import {DatabaseIntegrityException} from "@server/types/exceptions";
import {BlogPost as BlogPostModel} from "@prisma/client"
import {BlogPost, CreateBlogPostRequest, EditBlogPostRequest} from "@server/types/dtos/blogPosts";

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

export async function deleteBlogPost(prismaClient, blogPostId: number): Promise<void> {
    try {
        await prismaClient.blogPost.delete({
            where: {
                id: blogPostId,
            },
        });
    } catch (error) {
        console.error("Database Error", error);
        throw new DatabaseIntegrityException('Database error: Failed to delete blog post');
    }
}

export async function editBlogPost(
    prismaClient,
    editBlogPostRequest: EditBlogPostRequest
): Promise<void> {
    try {
        const dataToUpdate: any = {};

        if (editBlogPostRequest.title !== undefined) {
            dataToUpdate.title = editBlogPostRequest.title;
        }

        if (editBlogPostRequest.description !== undefined) {
            dataToUpdate.description = editBlogPostRequest.description;
        }

        if (editBlogPostRequest.content !== undefined) {
            dataToUpdate.content = editBlogPostRequest.content;
        }

        if (editBlogPostRequest.codeTemplateIds !== undefined) {
            dataToUpdate.codeTemplates = {
                set: [],
                create: editBlogPostRequest.codeTemplateIds.map((id) => ({
                    codeTemplate: {
                        connect: { id },
                    },
                })),
            };
        }

        await prismaClient.blogPost.update({
            where: {
                id: editBlogPostRequest.id,
            },
            data: dataToUpdate,
        });

        return;
    } catch (error) {
        console.error("Database Error", error);
        throw new DatabaseIntegrityException('Database error: Failed to update blog post');
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
