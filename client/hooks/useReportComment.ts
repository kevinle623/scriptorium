import {useMutation} from "@tanstack/react-query";
import {reportComment} from "@client/api/services/commentService";
import {ReportCommentRequest, ReportCommentResponse} from "@types/dtos/comments";

export const useReportComment = () => {
    return useMutation<ReportCommentResponse, Error, ReportCommentRequest>({
        mutationFn: reportComment,
    });
};