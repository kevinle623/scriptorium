export interface Comment {
    id: number;
    content: string;
    userId: number;
    blogPostId?: number | null;
    parentId?: number | null;
    createdAt: Date;
    hidden: boolean;
    replyIds: number[];
    upVotes: number;
    downVotes: number;
    reportIds: number[];
}