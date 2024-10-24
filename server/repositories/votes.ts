
import {Vote as VoteModel} from "@prisma/client"
import {Vote, VoteType} from "@server/types/dtos/votes"
import {DatabaseIntegrityException} from "@server/types/exceptions";
export async function toggleVote(
    prismaClient,
    userId: number,
    voteType: VoteType | null,
    blogPostId?: number,
    commentId?: number,
): Promise<Vote | null> {
    try {
        const existingVote = await prismaClient.vote.findFirst({
            where: {
                userId,
                blogPostId: blogPostId || null,
                commentId: commentId || null,
            },
        });

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
                });
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
                });
                return deserializeVote(newVote);
            }
            return null
        }
    } catch (e) {
        console.error('Database error: ', e);
        throw new DatabaseIntegrityException('Database error: failed to toggle vote');
    }
}



function deserializeVote(voteModel: VoteModel): Vote {
    return {
        id: voteModel.id,
        userId: voteModel.userId,
        blogPostId: voteModel.blogPostId || null,
        commentId: voteModel.commentId || null,
        voteType: voteModel.voteType,
    };
}
