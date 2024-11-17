import { useQuery } from "@tanstack/react-query";
import { GetCodeTemplatesRequest } from "@types/dtos/codeTemplates"
import {BlogPost} from "@types/dtos/blogPosts";
import {fetchCodeTemplates} from "@client/api/services/codeTemplateService";

export const useCodeTemplates = (filters: GetCodeTemplatesRequest) => {
    return useQuery<{ blogPosts: BlogPost[]; totalCount: number }>({
        queryKey: ["codeTemplates", filters],
        queryFn: async () => {
            const data = await fetchCodeTemplates(filters);
            return data;
        },
    });
};