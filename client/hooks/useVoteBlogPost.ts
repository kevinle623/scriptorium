import {useMutation, useQueryClient} from "@tanstack/react-query";
import {voteBlogPost} from "@client/api/services/blogPostService";
import {ToggleVoteRequest, ToggleVoteResponse} from "@/types/dtos/votes";

export const useVoteBlogPost = () => {
    const queryClient = useQueryClient();

    return useMutation<ToggleVoteResponse, Error, ToggleVoteRequest>({
        mutationFn: voteBlogPost,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["blogPostVotes", variables.blogPostId]
            }, );
        },
    });
};