import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditCommentRequest, GetCommentResponse } from "@/types/dtos/comments";
import { editComment } from "@client/api/services/commentService";

export const useEditComment = () => {
    const queryClient = useQueryClient();

    return useMutation<GetCommentResponse, Error, EditCommentRequest>({
        mutationFn: editComment,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["blogPostComments"]
            });
            queryClient.invalidateQueries({
                queryKey: ["replies"]
            });
        },
    });
};
