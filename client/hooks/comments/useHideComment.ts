import {updateCommentHiddenStatus} from "@client/api/services/commentService";
import {useMutation} from "@tanstack/react-query";
import {UpdateCommentHiddenStatusRequest, UpdateCommentHiddenStatusResponse} from "@/types/dtos/comments";

export const useHideComment = () => {
    return useMutation<
        UpdateCommentHiddenStatusResponse,
        Error,
        UpdateCommentHiddenStatusRequest
    >({
        mutationFn: updateCommentHiddenStatus
    });
};