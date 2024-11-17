
import {useQuery} from "@tanstack/react-query";
import {getCodeTemplateById} from "@client/api/services/codeTemplateService";
import {GetCodeTemplateResponse} from "@types/dtos/codeTemplates";


export const useCodeTemplateById = (id: number) => {
    return useQuery<GetCodeTemplateResponse, Error>({
        queryKey: ["codeTemplate", id],
        queryFn: () => getCodeTemplateById(id),
        enabled: !!id
    })
};