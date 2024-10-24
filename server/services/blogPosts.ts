
import {prisma} from "@server/libs/prisma/client";
import {BlogPost, CreateBlogPostRequest, EditBlogPostRequest, GetBlogPostRequest} from "@server/types/dtos/blogPosts";
import * as blogPostRepository from "@server/repositories/blogPosts"
import * as tagRepository from "@server/repositories/tags"
import {NotFoundException} from "@server/types/exceptions";
import {Comment} from "@server/types/dtos/comments";
import * as commentRepository from "@server/repositories/comments";
import * as reportRepository from "@server/repositories/reports";
import {VoteType} from "@server/types/dtos/votes";
import * as voteRepository from "@server/repositories/votes";

export async function createBlogPost(createBlogPostRequest: CreateBlogPostRequest){
    try {
        const newBlogPost = await blogPostRepository.createBlogPost(prisma, createBlogPostRequest)
        const tags = createBlogPostRequest.tags
        await tagRepository.createBlogPostTags(prisma, newBlogPost.id, tags)
        return newBlogPost
    } catch (e) {
        throw e
    }
}

export async function deleteBlogPost(blogPostId) {
    try {
        const existingBlogPost = await blogPostRepository.getBlogPostById(prisma, blogPostId)
        if (!existingBlogPost) {
            throw new NotFoundException("Blog Post does not exist")
        }
        await tagRepository.deleteBlogPostTags(prisma, blogPostId)
        await blogPostRepository.deleteBlogPost(prisma, blogPostId)
        return
    } catch (e) {
        throw e
    }
}

export async function updateBlogPost(editBlogPostRequest: EditBlogPostRequest) {
    try {
        const existingBlogPost = await blogPostRepository.getBlogPostById(prisma, editBlogPostRequest.blogPostId)
        if (!existingBlogPost) {
            throw new NotFoundException("Blog Post does not exist")
        }
        const tags = editBlogPostRequest.tags ?? []
        await blogPostRepository.editBlogPost(prisma, editBlogPostRequest)
        if (tags) {
            await tagRepository.updateBlogPostTags(prisma, editBlogPostRequest.blogPostId, tags)
        }
        const updatedBlogPost = await blogPostRepository.getBlogPostById(prisma, editBlogPostRequest.blogPostId)
        return updatedBlogPost
    } catch (e) {
        throw e
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
): Promise<Comment[]> {
    try {
        const blogPost = await blogPostRepository.getBlogPostById(prisma, blogPostId)
        if (!blogPost) {
            throw new NotFoundException("Blog Post does not exist")
        }
        const comments = await commentRepository.getDirectCommentsFromBlogPost(prisma, blogPostId, page, limit);
        return comments
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
): Promise<BlogPost[]> {
    try {
        const blogPosts = await blogPostRepository.getMostReportedBlogPosts(prisma, page, limit)
        return blogPosts
    } catch (e) {
        throw e
    }
}
