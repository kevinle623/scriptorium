import {deleteCodeTemplate} from "@client/api/services/codeTemplateService";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {AxiosError} from "axios";

export const useDeleteCodeTemplate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCodeTemplate,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["codeTemplates"]
            });
        },
        onError: (error) => {
            const axiosError = error as AxiosError<{ error: string }>;
            const errorMessage = axiosError.response?.data?.error
            console.error("Error deleting code template", errorMessage)
        },
    });
};