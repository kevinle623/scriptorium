export interface Report {
    id: number,
    reason: string,
    userId: number,
    blogPostId: number | null,
    commentId: number | null,
    createdAt: Date;
}