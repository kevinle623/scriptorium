import {DatabaseIntegrityException} from "@/types/exceptions";
import {BlogPost as BlogPostModel} from "@prisma/client"
import {
    BlogPost,
    CreateBlogPostRequest,
    EditBlogPostRequest,
    GetBlogPostRequest,
    GetBlogPostsResult
} from "@/types/dtos/blogPosts";
import {prisma} from "@server/libs/prisma/client";

export function buildBlogPostWhereCondition(getBlogPostsRequest: GetBlogPostRequest) {
    const { tagsList, content, title, codeTemplateIds, userId } = getBlogPostsRequest;

    const whereCondition: any = {};

    if (userId !== undefined) {
        whereCondition.OR = [
            { hidden: false },
            { userId: userId }
        ];
    } else {
        whereCondition.hidden = false;
    }

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

    if (content) {
        whereCondition.content = {
            contains: content,
        };
    }

    if (title) {
        whereCondition.title = {
            contains: title,
        };
    }

    if (codeTemplateIds && codeTemplateIds.length > 0) {
        whereCondition.codeTemplates = {
            some: {
                codeTemplateId: {
                    in: codeTemplateIds,
                },
            },
        };
    }

    return whereCondition;
}

export async function createBlogPost(
    prismaClient: any,
    createBlogPostRequest: CreateBlogPostRequest
): Promise<BlogPost> {
    try {
        const { title, description, content, userId, codeTemplateIds } = createBlogPostRequest;

        const data: any = {
            title,
            description,
            content,
            userId: Number(userId),
        };

        if (codeTemplateIds && codeTemplateIds.length > 0) {
            data.codeTemplates = {
                create: codeTemplateIds.map((id) => ({
                    codeTemplate: {
                        connect: { id },
                    },
                })),
            };
        }

        const blogPost = await prismaClient.blogPost.create({
            data,
        }) as BlogPostModel;

        return deserializeBlogPost(blogPost);
    } catch (error) {
        console.error("Database Error", error);
        throw new DatabaseIntegrityException('Database error: Failed to create blog post');
    }
}


export async function getBlogPostById(prismaClient: any, blogPostId: number): Promise<BlogPost | null> {
    try {
        const blogPost = await prismaClient.blogPost.findUnique({
            where: {
                id: blogPostId,
            }
        }) as BlogPostModel
        if (!blogPost) return null
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
            await prismaClient.blogPostCodeTemplate.deleteMany({
                where: {
                    blogPostId: editBlogPostRequest.blogPostId,
                },
            });



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
        const { page,
            limit,
        } = getBlogPostsRequest
        const skip = page && limit ? (page - 1) * limit : undefined;
        const take = limit || undefined;

        const whereCondition: any = buildBlogPostWhereCondition(getBlogPostsRequest)

        const totalCount = await prismaClient.blogPost.count({
            where: whereCondition,
        });

        const blogPosts = await prismaClient.blogPost.findMany({
            skip,
            take,
            where: whereCondition,
        });

        return {totalCount: totalCount, blogPosts: blogPosts.map(deserializeBlogPost)};
    } catch (e) {
        console.error('Database Error', e);
        throw new Error('Failed to fetch blog posts');
    }
}

export async function getMostReportedBlogPosts(
    prismaClient: any,
    getBlogPostsRequest: GetBlogPostRequest
) {
    try {
        let {page, limit} = getBlogPostsRequest
        page = page || 1
        limit = limit || 10
        const skip = (page - 1) * limit;

        const mostReportedBlogPosts = await prismaClient.blogPost.findMany({
            where: {
                report: {
                    some: {},
                },
            },
            include: {
                report: true,
            },
            orderBy: {
                report: {
                    _count: 'desc',
                },
            },
            skip,
            take: limit,
        });

        const result = mostReportedBlogPosts.map((blogPost: any) => ({
            ...blogPost,
            reportCount: blogPost.report.length,
        }));

        const totalCount = await prismaClient.blogPost.count({
            where: {
                report: {
                    some: {},
                },
            },
        });

        return { totalCount, blogPosts: result };
    } catch (error) {
        console.error("Database Error", error);
        throw new Error("Failed to fetch most reported blog posts");
    }
}


export async function getOrderedBlogPosts(
    prismaClient: any,
    getBlogPostsRequest: GetBlogPostRequest
) {
    try {
        const { page= 1, limit = 10, orderBy } = getBlogPostsRequest;

        const whereCondition: any = buildBlogPostWhereCondition(getBlogPostsRequest)

        let blogPosts = await prismaClient.blogPost.findMany({
            where: whereCondition,
            include: {
                votes: true,
            },
        });

        if (orderBy === 'mostControversial' || orderBy === 'mostValued') {
            blogPosts = blogPosts.map((blogPost: any) => {
                const upVotes = blogPost.votes.filter((vote: any) => vote.voteType === 'UP').length;
                const downVotes = blogPost.votes.filter((vote: any) => vote.voteType === 'DOWN').length;

                return {
                    ...blogPost,
                    totalVotes: upVotes + downVotes,
                    voteDifference: upVotes - downVotes,
                };
            });

            if (orderBy === 'mostControversial') {

                blogPosts.sort((a: any, b: any) => b.totalVotes - a.totalVotes);
            } else if (orderBy === 'mostValued') {
                blogPosts.sort((a: any, b: any) => b.voteDifference - a.voteDifference);
            }
        }

        const skip = page && limit ? (page - 1) * limit : undefined;
        const paginatedPosts = blogPosts.slice(skip, skip !== undefined ? skip + limit : undefined);

        const totalCount = blogPosts.length;
        return { totalCount, blogPosts: paginatedPosts.map(deserializeBlogPost) };
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
