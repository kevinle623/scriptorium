import {
    CreateCodeTemplateRequest,
    ExecuteCodeRequest,
    ExecuteCodeResponse,
    GetCodeTemplatesRequest
} from "@types/dtos/codeTemplates";
import axiosInstance from "@client/api/axiosInstance";


export const createCodeTemplate = async (data: CreateCodeTemplateRequest) => {
    const response = await axiosInstance.post("/code", data);
    return response.data;
};

export const getCodeTemplateById = async (id: number) => {
    const { data } = await axiosInstance.get(`/code/${id}`);
    return data.codeTemplate;
};

export const fetchCodeTemplates = async (filters: GetCodeTemplatesRequest) => {
    const { data } = await axiosInstance.get("/code", {
        params: filters,
    });
    return data;
};
export const executeCodeSnippet = async (
    payload: ExecuteCodeRequest
) => {
    const {data} = await axiosInstance.post<ExecuteCodeResponse>("/code/execute", payload);
    return data
};