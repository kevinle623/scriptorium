import {Tag} from "@prisma/client";

export enum CodingLanguage {
    JAVA = "java",
    PYTHON = "python",
    C = "c",
    CPLUSPLUS = "c++",
    JAVASCRIPT = "javascript"
}

export interface CodeTemplates {
    id: number;
    title: string;
    code: string;
    language: CodingLanguage,
    explanation?: string;
    userId: number;
    tagIds: number[]
}

export interface CodeTemplateTag {
    id: number;
    codeTemplateId: number;
    tagId: number;
    tag: Tag;
}

