import {
    CreateCodeTemplateRequest, DeleteCodeTemplateResponse,
    ExecuteCodeRequest,
    ExecuteCodeResponse,
    GetCodeTemplatesRequest, UpdateCodeTemplateRequest, UpdateCodeTemplateResponse
} from "@/types/dtos/codeTemplates";
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

export async function editCodeTemplate(request: UpdateCodeTemplateRequest): Promise<UpdateCodeTemplateResponse> {
    try {
        const response = await axiosInstance.put<UpdateCodeTemplateResponse>(`/code/${request.id}`, request, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'Failed to update code template.');
        }
        throw new Error('Failed to update code template.');
    }
}

export async function deleteCodeTemplate(id: number): Promise<DeleteCodeTemplateResponse> {
    try {
        const response = await axiosInstance.delete<{ message: string }>(`/code/${id}`);

        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'Failed to delete code template.');
        }
        throw new Error('Failed to delete code template.');
    }
}