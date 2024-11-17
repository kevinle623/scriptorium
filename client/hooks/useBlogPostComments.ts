import { useQuery } from "@tanstack/react-query";
import {fetchComments} from "@client/api/services/blogPostService";
import {Comment} from "@types/dtos/comments"

export const useBlogPostComments = (id: string) => {
    const { data: comments, isLoading: commentsLoading } =  useQuery<Comment[]>({
        queryKey: ["comments", id],
        queryFn: async () => {
            const data = await fetchComments(id);
            return data;
        },
    });

    return { comments, commentsLoading };
};