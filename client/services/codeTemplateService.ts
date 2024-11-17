import {ExecuteCodeRequest, ExecuteCodeResponse, GetCodeTemplatesRequest} from "@types/dtos/codeTemplates";
import axios from "axios";


export const fetchCodeTemplates = async (filters: GetCodeTemplatesRequest) => {
    const { data } = await axios.get("/api/code", {
        params: filters,
    });
    return data;
};
export const executeCodeSnippet = async (
    payload: ExecuteCodeRequest
) => {
    const {data} = await axios.post<ExecuteCodeResponse>("/api/code/execute", payload);
    return data
};