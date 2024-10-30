import {DatabaseIntegrityException} from "@server/types/exceptions";
import {BlogPost as BlogPostModel} from "@prisma/client"
import {
    BlogPost,
    CreateBlogPostRequest,
    EditBlogPostRequest,
    GetBlogPostRequest,
    GetBlogPostsResult
} from "@server/types/dtos/blogPosts";

export async function createBlogPost(prismaClient: any, createBlogPostRequest: CreateBlogPostRequest): Promise<BlogPost> {
    try {
        const blogPost = await prismaClient.blogPost.create({
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
        }) as BlogPostModel
        return deserializeBlogPost(blogPost)
    } catch (error) {
        console.error("Database Error", error)
        throw new DatabaseIntegrityException('Database error: Failed to create blog post');
    }
}

export async function getBlogPostById(prismaClient: any, blogPostId: number) {
    try {
        const blogPost = await prismaClient.blogPost.findUnique({
            where: {
                id: blogPostId,
            }
        }) as BlogPostModel
        return deserializeBlogPost(blogPost)
    } catch (error) {
        console.error("Database Error", error)
        throw new DatabaseIntegrityException('Database error: Failed to fetch blog post by id');

    }
}

export async function deleteBlogPost(prismaClient: any, blogPostId: number): Promise<void> {
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

export async function getBlogPostsByIds(
    prismaClient: any,
    ids: number[]
): Promise<BlogPost[]> {
    try {
        const blogPosts = await prismaClient.blogPost.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });

        return blogPosts.map(deserializeBlogPost);
    } catch (error) {
        console.error("Database Error", error);
        throw new DatabaseIntegrityException('Database error: Failed to fetch blog posts by IDs');
    }
}

export async function editBlogPost(
    prismaClient: any,
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

        if (editBlogPostRequest.hidden !== undefined) {
            dataToUpdate.hidden = editBlogPostRequest.hidden
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
                id: editBlogPostRequest.blogPostId,
            },
            data: dataToUpdate,
        });

        return;
    } catch (error) {
        console.error("Database Error", error);
        throw new DatabaseIntegrityException('Database error: Failed to update blog post');
    }
}

export async function getBlogPosts(
    prismaClient: any,
    getBlogPostsRequest: GetBlogPostRequest
): Promise<GetBlogPostsResult> {
    try {
        const { page, limit, tagsList, sortBy, sortOrd } = getBlogPostsRequest
        const skip = page && limit ? (page - 1) * limit : undefined;
        const take = limit || undefined;

        const whereCondition: any = {};

        if (tagsList && tagsList.length > 0) {
            whereCondition.tags = {
                some: {
                    tag: {
                        name: {
                            in: tagsList,
                        },
                    },
                },
            };
        }

        const totalCount = await prismaClient.blogPost.count({
            where: whereCondition,
        });

        const blogPosts = await prismaClient.blogPost.findMany({
            skip,
            take,
            where: whereCondition,
            ...(sortBy && sortOrd && {orderBy: {
                [sortBy]: sortOrd === 'desc' ? 'desc' : 'asc',
            }})
        });

        return {totalCount: totalCount, blogPosts: blogPosts.map(deserializeBlogPost)};
    } catch (e) {
        console.error('Database Error', e);
        throw new Error('Failed to fetch blog posts');
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
    };
}
