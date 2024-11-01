
import {prisma} from "@server/libs/prisma/client";
import {
    BlogPost,
    CreateBlogPostRequest,
    EditBlogPostRequest,
    GetBlogPostRequest, GetBlogPostsResult,
} from "@server/types/dtos/blogPosts";
import * as blogPostRepository from "@server/repositories/blogPosts"
import * as tagRepository from "@server/repositories/tags"
import {NotFoundException, ServiceException} from "@server/types/exceptions";
import {Comment, GetCommentsResult} from "@server/types/dtos/comments";
import * as commentRepository from "@server/repositories/comments";
import * as reportRepository from "@server/repositories/reports";
import {Vote, VoteType} from "@server/types/dtos/votes";
import * as voteRepository from "@server/repositories/votes";
import * as codeTemplateRepository from "@server/repositories/codeTemplates"


async function populateBlogPost(blogPost: BlogPost): Promise<BlogPost> {
    const blogPostId = blogPost.id
    blogPost.tags = await tagRepository.getTagNamesByBlogPostId(prisma, blogPostId)
    blogPost.commentIds = await commentRepository.getCommentIdsByBlogPostId(prisma, blogPostId)
    blogPost.codeTemplateIds = await codeTemplateRepository.getCodeTemplateIdsByBlogPostId(prisma, blogPostId)

    const {upVotes, downVotes} = await voteRepository.getVoteCountsByBlogPostId(prisma, blogPostId)
    blogPost.upVotes = upVotes || 0
    blogPost.downVotes = downVotes || 0
    return blogPost
}

export async function createBlogPost(createBlogPostRequest: CreateBlogPostRequest): Promise<BlogPost> {
    try {
        const newBlogPost = await prisma.$transaction(async (prismaTx) => {
            const createdBlogPost = await blogPostRepository.createBlogPost(prismaTx, createBlogPostRequest);
            if (createBlogPostRequest.tags && createBlogPostRequest.tags.length > 0) {
                const tags = await tagRepository.createBlogPostTags(prismaTx, createdBlogPost.id, createBlogPostRequest.tags);
                createdBlogPost.tags = tags
            }
            return createdBlogPost;
        });
        return populateBlogPost(newBlogPost);
    } catch (e) {
        throw e;
    }
}

export async function deleteBlogPost(blogPostId: number) {
    try {
        await prisma.$transaction(async (prismaTx) => {
            const existingBlogPost = await blogPostRepository.getBlogPostById(prismaTx, blogPostId);
            if (!existingBlogPost) {
                throw new NotFoundException("Blog Post does not exist");
            }
            await tagRepository.deleteBlogPostTags(prismaTx, blogPostId);
            await blogPostRepository.deleteBlogPost(prismaTx, blogPostId);
        });

        return;
    } catch (e) {
        throw e;
    }
}

export async function updateBlogPost(editBlogPostRequest: EditBlogPostRequest): Promise<BlogPost> {
    try {
        const { blogPostId, tags = [] } = editBlogPostRequest;
        const updatedBlogPost = await prisma.$transaction(async (prismaTx) => {
            const existingBlogPost = await blogPostRepository.getBlogPostById(prismaTx, blogPostId);
            if (!existingBlogPost) {
                throw new NotFoundException("Blog Post does not exist");
            }
            await blogPostRepository.editBlogPost(prismaTx, editBlogPostRequest);
            if (tags.length > 0) {
                await tagRepository.updateBlogPostTags(prismaTx, blogPostId, tags);
            }
            return await blogPostRepository.getBlogPostById(prismaTx, blogPostId);
        });

        if (!updatedBlogPost) {
            throw new NotFoundException("Blog Post not found");
        }

        return updatedBlogPost;
    } catch (e) {
        console.error("Error updating blog post: ", e);
        throw e;
    }
}

export async function getBlogPostById(blogPostId: number) {
    try {
        const blogPost = await blogPostRepository.getBlogPostById(prisma, blogPostId)
        if (!blogPost) {
            throw new NotFoundException("Blog Post does not exist")
        }


        return populateBlogPost(blogPost)
    } catch (e) {
        throw e
    }
}

export async function getBlogPosts(
    getBlogPostsRequest: GetBlogPostRequest
): Promise<GetBlogPostsResult> {
    try {
        const { orderBy } = getBlogPostsRequest;

        let totalCount, blogPosts;

        if (orderBy) {
            if (orderBy === 'mostReported') {
                ({ totalCount, blogPosts } = await blogPostRepository.getMostReportedBlogPosts(prisma, getBlogPostsRequest))
            } else {
                ({ totalCount, blogPosts } = await blogPostRepository.getOrderedBlogPosts(prisma, getBlogPostsRequest));
            }
        } else {
            ({ totalCount, blogPosts } = await blogPostRepository.getBlogPosts(prisma, getBlogPostsRequest));
        }

        const populatedBlogPosts = await Promise.all(
            blogPosts.map(async (blogPost: BlogPost) => {
                return {
                    ...await populateBlogPost(blogPost),
                };
            })
        );

        return { totalCount, blogPosts: populatedBlogPosts };
    } catch (e) {
        throw e;
    }
}


export async function addCommentToBlogPost(
    blogPostId: number,
    userId: number,
    content: string
): Promise<Comment> {
    try {
        const blogPost = await blogPostRepository.getBlogPostById(prisma, blogPostId)
        if (!blogPost) {
            throw new NotFoundException("Blog Post does not exist")
        }
        const comment = await commentRepository.createCommentToBlogPost(
            prisma,
            blogPostId,
            userId,
            content
        );
        return comment;
    } catch (error) {
        throw error;
    }
}

export async function reportBlogPost(userId: number, blogPostId: number, reason: string) {
    try {
        const existingReport = await reportRepository.getBlogPostReportByUser(prisma, userId, blogPostId)
        if (existingReport) {
            throw new ServiceException("User already reported this blog post.")
        }
        const report  = await reportRepository.createReport(prisma, reason, userId, blogPostId, undefined)
        return report
    } catch (e) {
        throw e
    }
}

export async function toggleBlogPostVote(
    userId: number,
    blogPostId: number,
    voteType: VoteType | null,
) {
    try {
        return await voteRepository.toggleVote(prisma, userId, voteType, blogPostId, undefined);
    } catch (e) {
        throw e
    }

}

export async function getBlogPostVoteByUserId(
    userId: number,
    blogPostId: number,
): Promise<Vote | null> {
    try {
        return await voteRepository.getBlogPostVoteByUserId(prisma, userId, blogPostId)
    } catch (e) {
        throw e
    }

}
export async function getDirectCommentsFromBlogPost(
    blogPostId: number,
    page: number,
    limit: number,
    userId?: number,
): Promise<GetCommentsResult> {
    try {
        const blogPost = await blogPostRepository.getBlogPostById(prisma, blogPostId)
        if (!blogPost) {
            throw new NotFoundException("Blog Post does not exist")
        }
        return await commentRepository.getDirectCommentsFromBlogPost(prisma, blogPostId, page, limit, userId);
    } catch (error) {
        throw error;
    }
}

export async function toggleHiddenBlogPost(blogPostId: number, hidden: boolean) {
    try {
        const blogPost = await blogPostRepository.getBlogPostById(prisma, blogPostId)
        if (!blogPost) throw new NotFoundException("Blog post does not exist")
        const updateBlogPostRequest = {
            blogPostId,
            hidden: hidden
        }
        await blogPostRepository.editBlogPost(prisma, updateBlogPostRequest)
    } catch (e) {
        throw e
    }

}