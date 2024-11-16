import {ExecuteCodeRequest, ExecuteCodeResponse} from "@types/dtos/codeTemplates";
import axios from "axios";


export const executeCodeSnippet = async (
    payload: ExecuteCodeRequest
): Promise<ExecuteCodeResponse> => {
    const response = await axios.post<ExecuteCodeResponse>("/api/code/execute", payload);
    return response.data;
};