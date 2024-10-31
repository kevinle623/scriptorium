import * as commentRepository from "@server/repositories/comments";
import {Comment, GetCommentsResult} from "@server/types/dtos/comments";
import {prisma} from "@server/libs/prisma/client";
import * as reportRepository from "@server/repositories/reports";
import {VoteType} from "@server/types/dtos/votes";
import * as voteRepository from "@server/repositories/votes";
import {NotFoundException} from "@server/types/exceptions";

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

export async function getCommentById(commentId: number): Promise<Comment> {
    try {
        const comment = await commentRepository.getCommentById(prisma, commentId)
        if (!comment){
            throw new NotFoundException("Comment not found")
        }

        comment.replyIds = await commentRepository.getCommentIdsByParentCommentId(prisma, comment.id)
        return comment

    } catch (e) {
        throw (e)
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
        await commentRepository.editComment(prisma, updateCommentRequest);
        const comment = commentRepository.getCommentById(prisma, commentId)
        return comment;
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
): Promise<GetCommentsResult> {
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
): Promise<{totalCount: number, comments: Comment[]}> {
    try {
        const {totalCount, commentIds} = await reportRepository.getCommentIdsByReportCount(prisma, page, limit)
        const comments = await commentRepository.getCommentsByIds(prisma, commentIds)
        return { totalCount, comments }
    } catch (e) {
        throw e
    }
}

