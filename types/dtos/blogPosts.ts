import {Tag} from "@/types/dtos/tags";

export interface BlogPostFilters {
    page?: number;
    limit?: number;
    title?: string;
    content?: string;
    tags?: string;
    orderBy?: string;
}

export interface BlogPost {
    id: number;
    title: string;
    description: string;
    content: string;
    userId: number;
    hidden: boolean;
    createdAt: Date;
    updatedAt: Date;
    codeTemplateIds?: number[];
    upVotes?: number;
    downVotes?: number;
    commentIds?: number[];
    tags?: string[];
}

export interface BlogPostTag {
    id: number;
    blogPostId: number;
    tagId: number;
    tag: Tag;
}

export interface CreateBlogPostForm {
    title: string;
    description: string;
    content: string;
    codeTemplateIds: number[]
    tags: string[]
    userId: number;
}

export interface CreateBlogPostRequest {
    title: string;
    description: string;
    content: string;
    codeTemplateIds: number[]
    tags: string[]
    userId: number;
}

export interface EditBlogPostRequest {
    blogPostId: number,
    title?: string;
    description?: string;
    content?: string;
    codeTemplateIds?: number[]
    tags?: string[]
    hidden?: boolean
}

export type BlogPostOrderType = undefined | 'mostValued' | 'mostControversial' | 'mostReported'

export interface GetBlogPostRequest {
    page?: number,
    limit?: number,
    title?: string,
    content?: string,
    codeTemplateIds?: number[],
    tagsList?: string[],
    orderBy: BlogPostOrderType
    userId?: number,
    mineOnly: boolean,
}

export interface GetBlogPostsResult {
    totalCount: number,
    blogPosts: BlogPost[]
}

export interface CreateBlogPostResponse {
    message: string;
    blogPost: {
        id: number;
        userId: number;
        title: string;
        description: string;
        content: string;
        hidden: boolean;
        codeTemplateIds: string[];
        createdAt: string;
        updatedAt: string;
        tags: string[];
        commentIds: string[];
    };
};


export interface ReportBlogPostRequest {
    id: string;
    reason: string;
}

export interface ReportBlogPostResponse {
    message: string;
    report: {
        id: string;
        userId: string;
        blogPostId: number;
        reason: string;
    };
}
