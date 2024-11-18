import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBlogPost } from "@client/api/services/blogPostService";

export const useDeleteBlogPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteBlogPost,
        onSuccess: () => {
            queryClient.invalidateQueries(["blogPosts"]);
        },
        onError: (error: any) => {
            console.error("Failed to delete blog post:", error);
        },
    });
};