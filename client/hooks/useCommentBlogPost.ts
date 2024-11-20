import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addCommentToBlogPost} from "@client/api/services/blogPostService";
import {AxiosError} from "axios";

export const useCommentBlogPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addCommentToBlogPost,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["comments", variables.id]
            });
        },
        onError: (error) => {
            const axiosError = error as AxiosError<{ error: string }>;
            const errorMessage = axiosError.response?.data?.error;
            console.error("Failed to add comment:", errorMessage);
        },
    });
};