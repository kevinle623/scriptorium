import { useQuery } from "@tanstack/react-query";
import {fetchComments} from "@client/api/services/blogPostService";
import {GetCommentsRequest, GetCommentsResult} from "@/types/dtos/comments"

export const useBlogPostComments = (payload: GetCommentsRequest) => {
    const { blogPostId, page, limit } = payload;
    const {
        data: result,
        isLoading: commentsLoading,
    } = useQuery<GetCommentsResult>({
        queryKey: ["blogPostComments", blogPostId, page, limit],
        queryFn: async () => {
            const data = await fetchComments({ blogPostId, page, limit });
            return data;
        },
    });

    const { totalCount, comments } = result || {};

    return {
        comments,
        totalCount,
        commentsLoading,
    };
};
