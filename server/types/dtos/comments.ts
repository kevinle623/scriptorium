import {CodeTemplate} from "@server/types/dtos/codeTemplates";

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

export interface EditCommentRequest {
    commentId: number,
    content?: string,
    hidden?: boolean,
}

export interface GetCommentsResult {
    totalCount: number,
    comments: Comment[]
}
