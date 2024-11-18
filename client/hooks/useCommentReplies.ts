import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "@client/api/services/commentService";
import {Comment} from "@types/dtos/comments";

export const useCommentReplies = (id: string) => {
    const { data: replies, isLoading: repliesLoading } =  useQuery<Comment[]>({
        queryKey: ["replies", id],
        queryFn: async () => {
            const data = await fetchComments(id);
            return data;
        },
    });

    return { replies, repliesLoading };
};