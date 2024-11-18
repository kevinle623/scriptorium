import {Tag} from "@types/dtos/tags";

export type ExecuteCodeRequest = {
    language: string;
    code: string;
    stdin: string;
};

export type ExecuteCodeResponse = {
    message: string;
    result: string;
};

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
    parentTemplateId?: number;
    tags: string[];
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
    userId?: string;
    code: string;
    parentTemplateId?: number;
    language: CodingLanguage;
    explanation?: string;
    tags: string[];
}

export interface GetCodeTemplatesRequest {
    title?: string;
    userId?: string;
    tags?: string;
    content?: string;
    page?: number;
    limit?: number;
}

export interface GetCodeTemplateResponse {
    id: number;
    userId: number;
    title: string;
    code: string;
    language: string;
    explanation: string;
    tags: string[];
}

export interface GetCodeTemplatesResult {
    totalCount: number,
    codeTemplates: CodeTemplate[]
}

export interface UpdateCodeTemplateRequest {
    id: number;
    title: string;
    code: string;
    language: string;
    explanation: string;
    tags: string[];
}

export interface UpdateCodeTemplateResponse {
    message: string;
    codeTemplate: {
        id: number;
        userId: number;
        title: string;
        code: string;
        language: string;
        explanation: string;
        tags: string[];
    };
}

export interface DeleteCodeTemplateResponse {
    message: string;
}
