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
    codeTemplateIds: number[]
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
}

export interface EditBlogPostRequest {
    id: number,
    title: string;
    description: string;
    content: string;
    codeTemplateIds: number[]
}
