import {DatabaseIntegrityException} from "@server/types/exceptions";
import {BlogPost as BlogPostModel, PrismaClient} from "@prisma/client"
import {
    BlogPost,
    CreateBlogPostRequest,
    EditBlogPostRequest,
    GetBlogPostRequest,
    GetBlogPostsResult
} from "@server/types/dtos/blogPosts";

export async function createBlogPost(prismaClient: any, createBlogPostRequest: CreateBlogPostRequest): Promise<BlogPost> {
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

export async function getBlogPostById(prismaClient: any, blogPostId: number) {
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

        const orderBy = sortBy
            ? {
                [sortBy]: sortOrd === 'desc' ? 'desc' : 'asc',
            }
            : undefined;

        const totalCount = await prismaClient.blogPost.count({
            where: whereCondition,
        });

        const blogPosts = await prismaClient.blogPost.findMany({
            skip,
            take,
            where: whereCondition,
            orderBy,
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
                votes: true,
                comments: true,
                codeTemplates: true,
            },
        });

        return {totalCount: totalCount, blogPosts: blogPosts.map(deserializeBlogPost)};
    } catch (e) {
        console.error('Database Error', e);
        throw new Error('Failed to fetch blog posts');
    }
}

export async function getMostReportedBlogPosts(
    prismaClient: any,
    page?: number,
    limit?: number
): Promise<GetBlogPostsResult> {
    try {
        const offset = page && limit ? (page - 1) * limit : undefined;
        const take = limit ?? undefined;
        const totalCount = await prismaClient.blogPost.count({
            where: {
                report: {
                    some: {},
                },
            },
        });

        const blogPosts = await prismaClient.blogPost.findMany({
            where: {
                report: {
                    some: {},
                },
            },
            orderBy: {
                reports: {
                    _count: 'desc',
                },
            },
            skip: offset,
            take: take,
            include: {
                user: true,
                tags: true,
                report: true,
                comments: true,
            },
        });

        return {totalCount: totalCount, blogPosts: blogPosts.map((blogPost: BlogPostModel) => deserializeBlogPost(blogPost))};
    } catch (e) {
        console.error('Database Error', e);
        throw new Error('Failed to fetch most reported blog posts');
    }
}


function deserializeBlogPost(blogPost: any): BlogPost {
    const upVotes = blogPost.votes.filter((vote: any) => vote.voteType === 'up').length || 0;
    const downVotes = blogPost.votes.filter((vote: any) => vote.voteType === 'down').length || 0;
    return {
        id: blogPost.id,
        title: blogPost.title,
        description: blogPost.description,
        content: blogPost.content,
        userId: blogPost.userId,
        hidden: blogPost.hidden,
        createdAt: blogPost.createdAt,
        updatedAt: blogPost.updatedAt,
        codeTemplateIds: blogPost.codeTemplates.map((template: any) => template.id),
        upVotes: upVotes,
        downVotes: downVotes,
        commentIds: blogPost.comments.map((comment: any) => comment.id),
        tagIds: blogPost.tags.map((tag: any) => tag.id),
    };
}
