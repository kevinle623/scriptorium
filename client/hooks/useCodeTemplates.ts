import { useQuery } from "@tanstack/react-query";
import {CodeTemplate, GetCodeTemplatesRequest} from "@types/dtos/codeTemplates"
import {fetchCodeTemplates} from "@client/api/services/codeTemplateService";

export const useCodeTemplates = (filters: GetCodeTemplatesRequest) => {
    return useQuery<{ codeTemplates: CodeTemplate[]; totalCount: number }>({
        queryKey: ["codeTemplates", filters],
        queryFn: async () => {
            const data = await fetchCodeTemplates(filters);
            return data;
        },
    });
};