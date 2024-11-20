import {Report} from "@/types/dtos/reports";

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
    reportCount?: number;
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

export interface GetCommentResponse {
    message: string
    comment: Comment
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

export interface GetCommentsRequest {
    page?: number,
    limit?: number,
    hidden?: boolean,
    blogPostId?: string | number,
    commentId?: string | number,
}

export interface GetCommentReportsRequest {
    page?: number,
    limit?: number,
    commentId: number,
}

export interface GetCommentReportsResponse {
    totalCount: number,
    reports: Report[]
}

export interface UpdateCommentHiddenStatusRequest {
    hidden: boolean;
    commentId: string | number;
}

export interface UpdateCommentHiddenStatusResponse {
    message: string;
    commentId: number;
    hidden: boolean;
}