import { useMutation } from "@tanstack/react-query";
import {voteBlogPost} from "../services/blogPostService";
import {ToggleVoteRequest, ToggleVoteResponse} from "@types/dtos/votes";

export const useVoteBlogPost = () => {
    return useMutation<ToggleVoteResponse, Error, ToggleVoteRequest>({
        mutationFn: voteBlogPost,
    });
};