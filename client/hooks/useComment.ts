import {useQuery} from "@tanstack/react-query";
import {getCommentById} from "@client/api/services/commentService";
import {Comment} from "@types/dtos/comments"

export const useComment = (id: string) => {
    const { data: comment, isLoading: commentLoading } =  useQuery<Comment>({
        queryKey: ["comment", id],
        queryFn: async () => {
            const data = await getCommentById(id);
            return data;
        },
    });
    return { comment, commentLoading };
};