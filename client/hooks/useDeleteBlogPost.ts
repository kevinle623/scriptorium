import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBlogPost } from "@client/api/services/blogPostService";
import {AxiosError} from "axios";

export const useDeleteBlogPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteBlogPost,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["blogPosts"]
            });
        },
        onError: (error) => {
            const axiosError = error as AxiosError<{ error: string }>;
            const errorMessage = axiosError.response?.data?.error

            console.error("Failed to delete blog post", errorMessage)
        },
    });
};