import {Tag} from "@server/types/dtos/tags";

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

export interface CreateBlogPostRequest {
    title: string;
    description: string;
    content: string;
    userId: number;
    codeTemplateIds: number[]
    tags: string[]
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
}

export interface GetBlogPostsResult {
    totalCount: number,
    blogPosts: BlogPost[]
}
