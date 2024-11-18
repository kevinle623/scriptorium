import * as commentRepository from "@server/repositories/comments";
import {Comment, GetCommentsResult} from "@/types/dtos/comments";
import {prisma} from "@server/libs/prisma/client";
import * as reportRepository from "@server/repositories/reports";
import {CommentVoteResponse, Vote, VoteType} from "@/types/dtos/votes";
import * as voteRepository from "@server/repositories/votes";
import {NotFoundException, ServiceException} from "@/types/exceptions";
async function populateComment(comment: Comment): Promise<Comment> {
    const commentId = comment.id
    comment.replyIds = await commentRepository.getCommentIdsByParentCommentId(prisma, comment.id)
    const {upVotes, downVotes} = await voteRepository.getVoteCountsByCommentId(prisma, commentId)
    comment.upVotes = upVotes || 0
    comment.downVotes = downVotes || 0
    return comment
}

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
        return await populateComment(comment);
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

        return await populateComment(comment)

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
        const comment = await commentRepository.getCommentById(prisma, commentId)
        if (!comment) throw new NotFoundException("Comment not found.")
        return comment;
    } catch (error) {
        throw error;
    }
}

export async function reportComment(userId: number, commentId: number, reason: string) {
    try {
        const existingReport = await reportRepository.getCommentReportByUser(prisma, userId, commentId)
        if (existingReport) throw new ServiceException("User already reported this comment.")
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
    limit?: number,
    userId?: number
): Promise<GetCommentsResult> {
    try {
        const comment = await commentRepository.getCommentById(prisma, commentId)
        if (!comment) {
            throw new NotFoundException("Comment not Found")

        }
        const { comments, totalCount } = await commentRepository.getDirectRepliesFromComment(prisma, commentId, page, limit, userId);

        const populatedComments = await Promise.all(
            comments.map(async (comment: Comment) => {
                return await populateComment(comment);
            })
        );

        return { comments: populatedComments, totalCount };
    } catch (error) {
        throw error
    }
}

export async function toggleHiddentComment(commentId: number, hidden: boolean) {
    try {
        const comment = await commentRepository.getCommentById(prisma, commentId)
        if (!comment) {
            throw new NotFoundException("Comment does not exist.")
        }
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
        const {totalCount, comments} = await commentRepository.getMostReportedComments(prisma, page, limit)
        const populatedComments = await Promise.all(
            comments.map(async (comment: Comment) => {
                return await populateComment(comment);
            })
        );

        return { comments: populatedComments, totalCount };
    } catch (e) {
        throw e
    }
}

export async function getCommentVoteByUserId(
    userId: number | null,
    commentId: number,
): Promise<CommentVoteResponse> {
    try {
        const userVote = userId ? await voteRepository.getCommentVoteByUserId(prisma, userId, commentId) : null
        const {upVotes, downVotes} = await voteRepository.getVoteCountsByCommentId(prisma, commentId)
        return {
            userVote,
            upVotes,
            downVotes,
        };
    } catch (e) {
        throw e
    }

}
