import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "@client/api/services/commentService";
import {GetCommentsRequest, GetCommentsResult} from "@/types/dtos/comments";

export const useCommentReplies = (payload: GetCommentsRequest) => {
    const { commentId, page, limit} = payload
    const { data: result, isLoading: repliesLoading } =  useQuery<GetCommentsResult>({
        queryKey: ["replies", commentId, page, limit],
        queryFn: async () => {
            const data = await fetchComments(payload);
            return data;
        },
    });

    const { totalCount, comments } = result || {};

    return { replies: comments, totalCount, repliesLoading };
};