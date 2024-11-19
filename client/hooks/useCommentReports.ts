import { useQuery } from "@tanstack/react-query";

import { useQuery } from "@tanstack/react-query";
import { GetCommentReportsRequest, GetCommentReportsResponse } from "@types/dtos/comments"
import { getCommentReports } from "@client/api/services/commentService";

export const useCommentReports = (id: number, page = 1, limit = 10) => {
    const { data: commentReports, isLoading: commentReportsLoading } = useQuery<GetCommentReportsResponse>({
        queryKey: ["commentReports", id, page, limit],
        queryFn: async () => {
            const payload: GetCommentReportsRequest = { commentId: id, page, limit };
            return await getCommentReports(payload);
        },
    });

    return { commentReports, commentReportsLoading };
};
