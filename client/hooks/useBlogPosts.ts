import { useQuery } from "@tanstack/react-query";
import { BlogPostsResponse, BlogPostFilters } from "@/types/dtos/blogPosts";
import { fetchBlogPosts} from "@client/api/services/blogPostService";

export const useBlogPosts = (filters: BlogPostFilters) => {
    return useQuery<BlogPostsResponse>({
        queryKey: ["blogPosts", filters],
        queryFn: async () => {
            const data = await fetchBlogPosts(filters);
            return data;
        },
    });
};