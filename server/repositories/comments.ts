import {DatabaseIntegrityException} from "@server/types/exceptions";
import {Comment as CommentModel, PrismaClient} from "@prisma/client"
import {Comment, EditCommentRequest, GetCommentsResult} from "@server/types/dtos/comments"

export async function getCommentById(
    prismaClient: any,
    commentId: number,
): Promise<Comment | null> {
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
        if (!comment) return null
        return deserializeComment(comment)
    } catch (e) {
        console.error("Database error: ", e)
        throw new DatabaseIntegrityException("Database error: failed to fetch comment")
    }
}
export async function createCommentToBlogPost(
    prismaClient: any,
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
        }) as CommentModel;
        return deserializeComment(comment)
    } catch (e) {
        console.error("Database error: ", e)
        throw new DatabaseIntegrityException("Database error: failed to create comment to blog post")
    }

}

export async function createCommentToComment(
    prismaClient: any,
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
        }) as CommentModel;

        return deserializeComment(newComment)

    } catch (e) {
        console.error("Database error: ", e)
        throw new DatabaseIntegrityException("Database error: failed to create comment to blog post")
    }
}

export async function deleteComment(
    prismaClient: any,
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
    prismaClient: any,
    editCommentRequest: EditCommentRequest
): Promise<void> {
    try {
        const existingComment = await prismaClient.comment.findUnique({
            where: { id: editCommentRequest.commentId },
        });

        if (!existingComment) {
            throw new DatabaseIntegrityException("Comment not found");
        }

        const updateData: Partial<{ content: string; hidden: boolean }> = {};

        if (editCommentRequest.content !== undefined) {
            updateData.content = editCommentRequest.content;
        }

        if (editCommentRequest.hidden !== undefined) {
            updateData.hidden = editCommentRequest.hidden;
        }

        await prismaClient.comment.update({
            where: { id: editCommentRequest.commentId },
            data: updateData,
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
    prismaClient: any,
    blogPostId: number,
    page?: number,
    limit?: number
): Promise<GetCommentsResult> {
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

        const totalCount = await prismaClient.comment.count({
            where: {
                blogPostId: blogPostId,
                parentId: null,
            },
        });

        const comments = await prismaClient.comment.findMany(queryOptions);

        return {
            comments: comments.map((comment: CommentModel) => deserializeComment(comment)),
            totalCount,
        };
    } catch (e) {
        console.error("Database error: ", e);
        throw new DatabaseIntegrityException("Database error: Failed to fetch direct comments");
    }
}

export async function getCommentIdsByParentCommentId(
    prismaClient: PrismaClient,
    parentCommentId: number
): Promise<number[]> {
    try {
        const comments = await prismaClient.comment.findMany({
            where: {
                parentId: parentCommentId,
            },
            select: {
                id: true,
            },
        });

        return comments.map(comment => comment.id);
    } catch (error) {
        console.error("Database error: ", error);
        throw new DatabaseIntegrityException("Database error: failed to fetch comment IDs by parent comment ID");
    }
}

export async function getCommentIdsByBlogPostId(
    prismaClient: PrismaClient,
    blogPostId: number
): Promise<number[]> {
    try {
        const comments = await prismaClient.comment.findMany({
            where: {
                blogPostId: blogPostId,
            },
            select: {
                id: true,
            },
        });

        return comments.map(comment => comment.id);
    } catch (error) {
        console.error("Database error: ", error);
        throw new DatabaseIntegrityException("Database error: failed to fetch comment IDs by blog post ID");
    }
}


export async function getCommentsByIds(
    prismaClient: any,
    ids: number[]
): Promise<Comment[]> {
    try {
        const comments = await prismaClient.comment.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
            include: {
                votes: true,
                replies: true,
            },
        });

        return comments.map(deserializeComment);
    } catch (error) {
        console.error("Database error: ", error);
        throw new DatabaseIntegrityException("Database error: failed to fetch comments by IDs");
    }
}


export async function getDirectRepliesFromComment(
    prismaClient: any,
    commentId: number,
    page?: number,
    limit?: number
): Promise<GetCommentsResult> {
    try {
        const totalCount = await prismaClient.comment.count({
            where: {
                parentId: commentId,
            },
        });

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
        const deserializedComments = comments.map((comment: CommentModel) => deserializeComment(comment));

        return { comments: deserializedComments, totalCount };
    } catch (e) {
        console.error("Database error: ", e);
        throw new DatabaseIntegrityException("Database error: Failed to fetch direct replies");
    }
}

function deserializeComment(commentModel: CommentModel): Comment {
    return {
        id: commentModel.id,
        content: commentModel.content,
        userId: commentModel.userId,
        blogPostId: commentModel.blogPostId || null,
        parentId: commentModel.parentId || null,
        createdAt: commentModel.createdAt,
        hidden: commentModel.hidden,
    };

}