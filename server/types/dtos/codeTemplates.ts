import {Tag} from "@prisma/client";

export interface CodeTemplates {
    id: number;
    title: string;
    code: string;
    explanation?: string;
    userId: number;
}

export interface CodeTemplateTag {
    id: number;
    codeTemplateId: number;
    tagId: number;
    tag: Tag;
}

