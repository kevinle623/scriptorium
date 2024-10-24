import {Tag} from "@prisma/client";

export enum CodingLanguage {
    JAVA = "java",
    PYTHON = "python",
    C = "c",
    CPLUSPLUS = "c++",
    JAVASCRIPT = "javascript"
}

export interface CodeTemplate {
    id: number;
    title: string;
    code: string;
    language: CodingLanguage;
    explanation?: string;
    userId: number;
    parentTemplateId: number;
    tagIds: number[];
    createdAt: Date;
    updatedAt: Date;
}

export interface CodeTemplateTag {
    id: number;
    codeTemplateId: number;
    tagId: number;
    tag: Tag;
}

export interface CodeExecutionRequest {
    language: CodingLanguage;
    code: string;
    stdin?: string;
}

export interface UpdateCodeTemplateRequest {
    id: number;
    title?: string;
    code?: string;
    language?: CodingLanguage;
    explanation?: string;
    tags?: string[]
}

export interface CreateCodeTemplateRequest {
    title: string;
    userId: number;
    code: string;
    parentTemplateId?: number;
    language: CodingLanguage;
    explaination: string;
    tags: string[];
}

export interface ForkCodeTemplateRequest {
    title: string;
    userId: number;
    parentTemplateId: number;
}

export interface GetCodeTemplatesResult {
    totalCount: number,
    codeTemplates: CodeTemplate[]
}

