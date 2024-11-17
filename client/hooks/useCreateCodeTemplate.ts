import { useMutation } from "@tanstack/react-query";
import { createCodeTemplate } from "@client/api/services/codeTemplateService";
import {CodeTemplate, CreateCodeTemplateRequest} from "@types/dtos/codeTemplates";


export const useCreateCodeTemplate = () => {
    return useMutation<CodeTemplate, Error, CreateCodeTemplateRequest>({
        mutationFn: createCodeTemplate,
    });
};