import {useQuery} from "@tanstack/react-query";
import {GetCommentsRequest, GetCommentsResult} from "@/types/dtos/comments";
import {getMostReportedComments} from "@client/api/services/commentService";

export const useMostReportedComments = (filters: GetCommentsRequest) => {
    return useQuery<GetCommentsResult>({
        queryKey: ["comments", filters],
        queryFn: async () => {
            const data = await getMostReportedComments(filters);
            return data;
        },
    });
};