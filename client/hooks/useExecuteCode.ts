import {useMutation} from "@tanstack/react-query";
import {ExecuteCodeRequest, ExecuteCodeResponse} from "@types/dtos/codeTemplates";
import {executeCodeSnippet} from "@client/services/codeTemplateService";

export const useExecuteCode = () => {
    return useMutation<ExecuteCodeResponse, Error, ExecuteCodeRequest>({
        mutationFn: executeCodeSnippet,
    });
};
