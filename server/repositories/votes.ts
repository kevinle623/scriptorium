
import {Vote as VoteModel} from "@prisma/client"
import {Vote, VoteType} from "@/types/dtos/votes"
import {DatabaseIntegrityException} from "@/types/exceptions";
export async function toggleVote(
    prismaClient: any,
    userId: number,
    voteType: VoteType | null,
    blogPostId?: number,
    commentId?: number,
): Promise<Vote | null> {
    try {
        const existingVote = await prismaClient.vote.findFirst({
            where: {
                userId: userId,
                blogPostId: blogPostId || null,
                commentId: commentId || null,
            },
        }) as VoteModel;

        if (existingVote) {
            if (voteType === null) {
                await prismaClient.vote.delete({
                    where: { id: existingVote.id },
                });
                return null;
            } else {
                const updatedVote = await prismaClient.vote.update({
                    where: { id: existingVote.id },
                    data: { voteType },
                }) as VoteModel;
                return deserializeVote(updatedVote);
            }
        } else {
            if (voteType !== null) {
                const newVote = await prismaClient.vote.create({
                    data: {
                        userId,
                        blogPostId: blogPostId || null,
                        commentId: commentId || null,
                        voteType,
                    },
                }) as VoteModel;
                return deserializeVote(newVote);
            }
            return null
        }
    } catch (e) {
        console.error('Database error: ', e);
        throw new DatabaseIntegrityException('Database error: failed to toggle vote');
    }
}

export async function getVoteCountsByBlogPostId(
    prismaClient: any,
    blogPostId: number
): Promise<{ upVotes: number; downVotes: number }> {
    try {
        const upVotes = await prismaClient.vote.count({
            where: {
                blogPostId: blogPostId,
                voteType: "UP",
            },
        });

        const downVotes = await prismaClient.vote.count({
            where: {
                blogPostId: blogPostId,
                voteType: "DOWN",
            },
        });

        return { upVotes, downVotes };
    } catch (error) {
        console.error("Database Error", error);
        throw new DatabaseIntegrityException("Database error: Failed to fetch vote counts by blog post ID");
    }
}

export async function getVoteCountsByCommentId(
    prismaClient: any,
    commentId: number
): Promise<{ upVotes: number; downVotes: number }> {
    try {
        const upVotes = await prismaClient.vote.count({
            where: {
                commentId: commentId,
                voteType: "UP",
            },
        });

        const downVotes = await prismaClient.vote.count({
            where: {
                commentId: commentId,
                voteType: "DOWN",
            },
        });

        return { upVotes, downVotes };
    } catch (error) {
        console.error("Database Error", error);
        throw new DatabaseIntegrityException("Database error: Failed to fetch vote counts by comment ID");
    }
}

export async function getBlogPostVoteByUserId(
    prismaClient: any,
    userId: number,
    blogPostId: number
): Promise<Vote | null> {
    try {
        const vote = await prismaClient.vote.findFirst({
            where: {
                userId: userId,
                blogPostId: blogPostId,
            },
        }) as VoteModel | null;

        return vote ? deserializeVote(vote) : null;
    } catch (error) {
        console.error("Database Error", error);
        throw new DatabaseIntegrityException("Database error: Failed to fetch vote by user ID for blog post");
    }
}

export async function getCommentVoteByUserId(
    prismaClient: any,
    userId: number,
    commentId: number
): Promise<Vote | null> {
    try {
        const vote = await prismaClient.vote.findFirst({
            where: {
                userId: userId,
                commentId: commentId,
            },
        }) as VoteModel | null;

        return vote ? deserializeVote(vote) : null;
    } catch (error) {
        console.error("Database Error", error);
        throw new DatabaseIntegrityException("Database error: Failed to fetch vote by user ID for comment");
    }
}

function deserializeVote(voteModel: VoteModel): Vote {
    return {
        id: voteModel.id,
        userId: voteModel.userId,
        blogPostId: voteModel.blogPostId || null,
        commentId: voteModel.commentId || null,
        voteType: voteModel.voteType as VoteType,
    };
}
