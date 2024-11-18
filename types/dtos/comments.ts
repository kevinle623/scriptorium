export interface Comment {
    id: number;
    content: string;
    userId: number;
    blogPostId?: number | null;
    parentId?: number | null;
    createdAt: Date;
    hidden: boolean;
    replyIds?: number[];
    upVotes?: number;
    downVotes?: number;
    reportIds?: number[];
}
export interface AddCommentRequest {
    id: string;
    content: string;
}

export interface AddCommentResponse {
    message: string;
    comment: {
        id: string;
        userId: string;
        blogPostId: number;
        content: string;
        createdAt: string;
    };
}
export interface EditCommentRequest {
    commentId: number,
    content?: string,
    hidden?: boolean,
}

export interface GetCommentsResult {
    totalCount: number,
    comments: Comment[]
}

export interface ReportCommentRequest {
    id: string;
    reason: string;
}

export interface ReportCommentResponse {
    message: string;
    report: {
        id: string;
        userId: string;
        commentId: number;
        reason: string;
    };
}
