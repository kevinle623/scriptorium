import { useMutation } from '@tanstack/react-query';
import { UpdateCodeTemplateRequest, UpdateCodeTemplateResponse } from '@types/dtos/codeTemplates';
import {editCodeTemplate} from "@client/api/services/codeTemplateService";

export const useUpdateCodeTemplate = () => {
    return useMutation<UpdateCodeTemplateResponse, Error, UpdateCodeTemplateRequest>({
        mutationFn: editCodeTemplate,
    });
};
