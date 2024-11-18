import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addReplyToComment} from "@client/api/services/commentService";

export const useReplyComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addReplyToComment,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(["replies", variables.id]);
        },
        onError: (error: any) => {
            console.error("Failed to add reply to comment:", error.message);
        },
    });
};