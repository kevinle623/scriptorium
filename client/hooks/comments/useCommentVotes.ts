import {useQuery} from "@tanstack/react-query";
import {getCommentVotes} from "@client/api/services/commentService";

export const useCommentVotes = (commentId: number) => {
    return useQuery({
        queryKey: ["commentVotes", commentId],
        queryFn: () => getCommentVotes(commentId),
        enabled: !!commentId,
    });
};