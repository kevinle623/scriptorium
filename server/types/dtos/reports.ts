import {CodeTemplate} from "@server/types/dtos/codeTemplates";

export interface Report {
    id: number,
    reason: string,
    userId: number,
    blogPostId: number | null,
    commentId: number | null,
    createdAt: Date;
}

export interface GetReportsResult {
    totalCount: number,
    reports: Report[]
}