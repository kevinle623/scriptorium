import {deleteCodeTemplate} from "@client/api/services/codeTemplateService";
import {useMutation, useQueryClient} from "@tanstack/react-query";

export const useDeleteCodeTemplate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCodeTemplate,
        onSuccess: () => {
            queryClient.invalidateQueries(["codeTemplates"]);
        },
        onError: (error: any) => {
            console.error("Failed to delete code template:", error);
        },
    });
};