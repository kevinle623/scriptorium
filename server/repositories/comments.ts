import {DatabaseIntegrityException} from "@server/types/exceptions";
import {Comment as CommentModel} from "@prisma/client"
import {Comment} from "@server/types/dtos/comments"

export async function getCommentById(
    prismaClient,
    commentId,
): Promise<Comment> {
    try {
        const comment = await prismaClient.comment.findUnique({
            where: {
                id: commentId,
            },
            include: {
                votes: true,
                replies: true,
            },
        });
        return comment
    } catch (e) {
        console.error("Database error: ", e)
        throw new DatabaseIntegrityException("Database error: failed to fetch comment")
    }
}
export async function createCommentToBlogPost(
    prismaClient,
    blogPostId: number,
    userId: number,
    content: string
): Promise<Comment> {
    try {
        const comment = await prismaClient.comment.create({
            data: {
                content,
                userId,
                blogPostId,
            },
        });
        return deserializeComment(comment)
    } catch (e) {
        console.error("Database error: ", e)
        throw new DatabaseIntegrityException("Database error: failed to create comment to blog post")
    }

}

export async function createCommentToComment(
    prismaClient,
    parentCommentId: number,
    userId: number,
    content: string
): Promise<Comment> {
    try {
        const newComment = await prismaClient.comment.create({
            data: {
                content,
                userId,
                parentId: parentCommentId,
            },
        });

        return deserializeComment(newComment)

    } catch (e) {
        console.error("Database error: ", e)
        throw new DatabaseIntegrityException("Database error: failed to create comment to blog post")
    }
}

export async function deleteComment(
    prismaClient,
    commentId: number
): Promise<void> {
    try {
        const replies = await prismaClient.comment.findMany({
            where: {
                parentId: commentId,
            },
        });

        for (const reply of replies) {
            await deleteComment(prismaClient, reply.id);
        }

        await prismaClient.comment.delete({
            where: {
                id: commentId,
            },
        });
    } catch (e) {
        console.error("Database error: ", e)
        throw new DatabaseIntegrityException("Database error: failed to delete comment")
    }

}

export async function editComment(
    prismaClient,
    commentId: number,
    content: string
): Promise<Comment> {
    try {
        const existingComment = await prismaClient.comment.findUnique({
            where: { id: commentId },
        });

        if (!existingComment) {
            throw new DatabaseIntegrityException("Comment not found");
        }

        await prismaClient.comment.update({
            where: { id: commentId },
            data: {
                content: content,
            },
            include: {
                replies: true,
                votes: true,
                reports: true,
            },
        });

        return
    } catch (e) {
        console.error("Database error: ", e);
        throw new DatabaseIntegrityException("Database error: failed to update comment");
    }
}

export async function getDirectCommentsFromBlogPost(
    prismaClient,
    blogPostId: number,
    page?: number,
    limit?: number
): Promise<Comment[]> {
    try {
        const queryOptions: any = {
            where: {
                blogPostId: blogPostId,
                parentId: null,
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                votes: true,
            },
        };

        if (page && limit) {
            const skip = (page - 1) * limit;
            queryOptions.skip = skip;
            queryOptions.take = limit;
        }

        const comments = await prismaClient.comment.findMany(queryOptions);
        return comments.map((comment) => deserializeComment(comment));
    } catch (e) {
        console.error("Database error: ", e);
        throw new DatabaseIntegrityException("Database error: Failed to fetch direct comments");
    }
}

export async function getDirectRepliesFromComment(
    prismaClient,
    commentId: number,
    page?: number,
    limit?: number
): Promise<Comment[]> {
    try {
        const queryOptions: any = {
            where: {
                parentId: commentId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                votes: true,
            },
        };

        if (page && limit) {
            const skip = (page - 1) * limit;
            queryOptions.skip = skip;
            queryOptions.take = limit;
        }

        const comments = await prismaClient.comment.findMany(queryOptions);
        return comments.map((comment) => deserializeComment(comment));
    } catch (e) {
        console.error("Database error: ", e);
        throw new DatabaseIntegrityException("Database error: Failed to fetch direct replies");
    }
}


function deserializeComment(commentModel: CommentModel): Comment {
    const upVotes = commentModel.votes.filter(vote => vote.voteType === 'up').length;
    const downVotes = commentModel.votes.filter(vote => vote.voteType === 'down').length;

    return {
        id: commentModel.id,
        content: commentModel.content,
        userId: commentModel.userId,
        blogPostId: commentModel.blogPostId || null,
        parentId: commentModel.parentId || null,
        createdAt: commentModel.createdAt,
        hidden: commentModel.hidden,
        replyIds: commentModel.replies.map(reply => reply.id),
        upVotes: upVotes,
        downVotes: downVotes,
        reportIds: commentModel.reports.map(report => report.id),
    };
}