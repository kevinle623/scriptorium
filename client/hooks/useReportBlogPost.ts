import {useMutation} from "@tanstack/react-query";
import {reportBlogPost} from "@client/services/blogPostService"
import {ReportBlogPostResponse, ReportBlogPostRequest} from "@types/dtos/blogPosts";

export const useReportBlogPost = () => {
    return useMutation<ReportBlogPostResponse, Error, ReportBlogPostRequest>({
        mutationFn: reportBlogPost,
    });
};