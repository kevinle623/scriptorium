import {ExecuteCodeRequest, ExecuteCodeResponse, GetCodeTemplatesRequest} from "@types/dtos/codeTemplates";
import axiosInstance from "@client/api/axiosInstance";



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