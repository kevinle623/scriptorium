
import {prisma} from "@server/libs/prisma/client";
import {
    CreateBlogPostRequest,
    EditBlogPostRequest,
    GetBlogPostRequest,
    GetBlogPostsResult
} from "@server/types/dtos/blogPosts";
import * as blogPostRepository from "@server/repositories/blogPosts"
import * as tagRepository from "@server/repositories/tags"
import {NotFoundException} from "@server/types/exceptions";
import {Comment, GetCommentsResult} from "@server/types/dtos/comments";
import * as commentRepository from "@server/repositories/comments";
import * as reportRepository from "@server/repositories/reports";
import {VoteType} from "@server/types/dtos/votes";
import * as voteRepository from "@server/repositories/votes";

export async function createBlogPost(createBlogPostRequest: CreateBlogPostRequest) {
    try {
        const newBlogPost = await prisma.$transaction(async (prismaTx) => {
            const createdBlogPost = await blogPostRepository.createBlogPost(prismaTx, createBlogPostRequest);
            if (createBlogPostRequest.tags && createBlogPostRequest.tags.length > 0) {
                await tagRepository.createBlogPostTags(prismaTx, createdBlogPost.id, createBlogPostRequest.tags);
            }
            return createdBlogPost;
        });
        return newBlogPost;
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

export async function updateBlogPost(prisma, editBlogPostRequest: EditBlogPostRequest) {
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
        return blogPost
    } catch (e) {
        throw e
    }
}

export async function getBlogPosts(getBlogPostsRequest: GetBlogPostRequest) {
    try {
        const blogPosts = await blogPostRepository.getBlogPosts(prisma, getBlogPostsRequest)
        return blogPosts
    } catch (e) {
        throw e
    }
}

export async function addCommentToBlogPost(
    blogPostId: number,
    userId: number,
    content: string
): Promise<Comment> {
    try {
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
export async function getDirectCommentsFromBlogPost(
    blogPostId: number,
    page: number,
    limit: number
): Promise<GetCommentsResult> {
    try {
        const blogPost = await blogPostRepository.getBlogPostById(prisma, blogPostId)
        if (!blogPost) {
            throw new NotFoundException("Blog Post does not exist")
        }
        return await commentRepository.getDirectCommentsFromBlogPost(prisma, blogPostId, page, limit);
    } catch (error) {
        throw error;
    }
}

export async function toggleHiddenBlogPost(blogPostId: number, hidden: boolean) {
    try {
        const updateBlogPostRequest = {
            blogPostId,
            hidden: hidden
        }
        await blogPostRepository.editBlogPost(prisma, updateBlogPostRequest)
    } catch (e) {
        throw e
    }

}

export async function getMostReportedBlogPosts(
    page?: number,
    limit?: number,
): Promise<GetBlogPostsResult> {
    try {
        return await blogPostRepository.getMostReportedBlogPosts(prisma, page, limit)
    } catch (e) {
        throw e
    }
}