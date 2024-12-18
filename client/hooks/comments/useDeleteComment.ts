import { useMutation, useQueryClient } from "@tanstack/react-query";
import {deleteComment} from "@client/api/services/commentService"

export const useDeleteComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteComment,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["blogPostComments"]
            });
            queryClient.invalidateQueries({
                queryKey: ["replies"]
            });
        },
        onError: (error) => {
            console.error("Failed to delete comment:", error);
        },
    });
};