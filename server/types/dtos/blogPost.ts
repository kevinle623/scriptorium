import {Tag} from "@server/types/dtos/tags";

export interface BlogPost {
    id: number;
    title: string;
    description: string;
    content: string;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface BlogPostTag {
    id: number;
    blogPostId: number;
    tagId: number;
    tag: Tag;
}
