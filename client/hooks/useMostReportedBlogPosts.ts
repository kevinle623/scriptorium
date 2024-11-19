import {BlogPostFilters, GetBlogPostsResult} from "@types/dtos/blogPosts";
import {useQuery} from "@tanstack/react-query";
import {getMostReportedBlogPosts} from "@client/api/services/blogPostService";

export const useMostReportedBlogPosts = (filters: BlogPostFilters) => {
    return useQuery<GetBlogPostsResult>({
        queryKey: ["blogPosts", filters],
        queryFn: async () => {
            const data = await getMostReportedBlogPosts(filters);
            return data;
        },
    });
};