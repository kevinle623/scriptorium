import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addCommentToBlogPost} from "@client/api/services/blogPostService";

export const useCommentBlogPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addCommentToBlogPost,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(["comments", variables.id]);
        },
        onError: (error: any) => {
            console.error("Failed to add comment:", error.message);
        },
    });
};