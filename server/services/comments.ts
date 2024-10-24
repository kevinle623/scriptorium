import * as commentRepository from "@server/repositories/comments";
import {Comment} from "@server/types/dtos/comments";
import {prisma} from "@server/libs/prisma/client";
import * as reportRepository from "@server/repositories/reports";
import {VoteType} from "@server/types/dtos/votes";
import * as voteRepository from "@server/repositories/votes";
import {NotFoundException} from "@server/types/exceptions";
import * as blogPostRepository from "@server/repositories/blogPosts";
import {BlogPost} from "@server/types/dtos/blogPosts";

export async function addCommentToComment(
    parentCommentId: number,
    userId: number,
    content: string
): Promise<Comment> {
    try {
        const comment = await commentRepository.createCommentToComment(
            prisma,
            parentCommentId,
            userId,
            content
        );
        return comment;
    } catch (error) {
        throw error;
    }
}

export async function removeComment(
    commentId: number
): Promise<void> {
    try {
        await commentRepository.deleteComment(prisma, commentId);
    } catch (error) {
        console.error("Service Error: ", error);
        throw error;
    }
}

export async function updateComment(
    commentId: number,
    content: string
): Promise<Comment> {
    try {
        const updateCommentRequest = {
            commentId,
            content,
        }
        const updatedComment = await commentRepository.editComment(prisma, updateCommentRequest);
        return updatedComment;
    } catch (error) {
        throw error;
    }
}

export async function reportComment(userId: number, commentId: number, reason: string) {
    try {
        const report = await reportRepository.createReport(prisma, reason, userId, undefined, commentId)
        return report
    } catch (e) {
        throw e
    }
}

export async function toggleCommentVote(
    userId: number,
    commentId: number,
    voteType: VoteType | null,
) {
    try {
        return await voteRepository.toggleVote(prisma, userId, voteType, undefined, commentId);
    } catch (e) {
        throw e
    }
}

export async function getDirectRepliesFromComment(
    commentId: number,
    page?: number,
    limit?: number
): Promise<{ comments: Comment[], totalCount: number }> {
    try {
        const comment = await commentRepository.getCommentById(prisma, commentId)
        if (!comment) {
            throw new NotFoundException("Comment not Found")

        }
        const { comments, totalCount } = await commentRepository.getDirectRepliesFromComment(prisma, commentId, page, limit);
        return { comments, totalCount }
    } catch (error) {
        throw error
    }
}

export async function toggleHiddentComment(commentId: number, hidden: boolean) {
    try {
        const updateCommentRequest = {
            commentId,
            hidden: hidden
        }
        await commentRepository.editComment(prisma, updateCommentRequest)
    } catch (e) {
        throw e
    }

}

export async function getMostReportedComments(
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

