import {getBlogPostReports} from "@client/api/services/blogPostService"
import {GetBlogPostReportsRequest, GetBlogPostReportsResponse} from "@types/dtos/blogPosts";
import {useQuery} from "@tanstack/react-query";

export const useBlogPostReports = (blogPostId: number, page = 1, limit = 10) => {
    const { data: blogPostReports, isLoading: blogPostReportsLoading } = useQuery<GetBlogPostReportsResponse>({
        queryKey: ["blogPostReports", blogPostId, page, limit],
        queryFn: async () => {
            const payload: GetBlogPostReportsRequest = { blogPostId, page, limit };
            return await getBlogPostReports(payload);
        },
    });
    return { blogPostReports, blogPostReportsLoading };
};