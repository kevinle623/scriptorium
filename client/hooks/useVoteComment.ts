import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ToggleVoteRequest, ToggleVoteResponse} from "@types/dtos/votes";
import {voteComment} from "@client/api/services/commentService";

export const useVoteComment = () => {
    const queryClient = useQueryClient();

    return useMutation<ToggleVoteResponse, Error, ToggleVoteRequest>({
        mutationFn: voteComment,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(["commentVotes", variables.commentId]);
        },
    });
};