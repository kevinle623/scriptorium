import {Tag} from "@/types/dtos/tags";

export type ExecuteCodeRequest = {
    language?: CodingLanguage;
    code?: string;
    stdin: string;
};

export type ExecuteCodeResponse = {
    message: string;
    result: string;
};

export enum CodingLanguage {
    C = "c",
    CPLUSPLUS = "c++",
    JAVA = "java",
    PYTHON = "python",
    JAVASCRIPT = "javascript",
    RUBY = "ruby",
    GO = "go",
    PHP = "php",
    SWIFT = "swift",
    KOTLIN = "kotlin",
    RUST = "rust"
}


export interface CodeTemplate {
    id: number;
    title?: string;
    code?: string;
    language?: CodingLanguage;
    explanation?: string;
    userId: number;
    parentTemplateId?: number;
    tags?: string[];
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
    language?: CodingLanguage;
    code?: string;
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
    title?: string;
    userId?: string;
    code?: string;
    parentTemplateId?: number;
    language: CodingLanguage;
    explanation?: string;
    tags?: string[];
}

export interface GetCodeTemplatesRequest {
    title?: string;
    userId?: string;
    tags?: string;
    content?: string;
    page?: number;
    limit?: number;
    mineOnly?: boolean;
    ids?: string
}

export interface GetCodeTemplateResponse {
    id: number;
    userId: number;
    title?: string;
    code?: string;
    language?: CodingLanguage;
    explanation?: string;
    tags?: string[];
}

export interface GetCodeTemplatesResult {
    totalCount: number,
    codeTemplates: CodeTemplate[]
}

export interface UpdateCodeTemplateRequest {
    id: number;
    title?: string;
    code?: string;
    language?: CodingLanguage;
    explanation?: string;
    tags?: string[];
}

export interface UpdateCodeTemplateResponse {
    message: string;
    codeTemplate: {
        id: number;
        userId: number;
        title: string;
        code?: string;
        language?: CodingLanguage;
        explanation?: string;
        tags?: string[];
    };
}

export interface DeleteCodeTemplateResponse {
    message: string;
}
