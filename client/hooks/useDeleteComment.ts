import { useMutation, useQueryClient } from "@tanstack/react-query";
import {deleteComment} from "@client/api/services/commentService"

export const useDeleteComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteComment,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["comments"]
            });
        },
        onError: (error) => {
            console.error("Failed to delete comment:", error);
        },
    });
};