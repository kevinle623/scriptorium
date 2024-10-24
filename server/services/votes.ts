import {prisma} from "@server/libs/prisma/client";
import * as voteRepository from "@server/repositories/votes"
import {VoteType} from "@server/types/dtos/votes";

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