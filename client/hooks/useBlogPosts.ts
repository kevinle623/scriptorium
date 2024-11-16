import { useQuery } from "@tanstack/react-query";
import { BlogPost, BlogPostFilters } from "@/types/dtos/blogPosts";
import { fetchBlogPosts} from "@client/services/blogPostService";

export const useBlogPosts = (filters: BlogPostFilters) => {
    return useQuery<{ blogPosts: BlogPost[]; totalCount: number }>({
        queryKey: ["blogPosts", filters],
        queryFn: async () => {
            const data = await fetchBlogPosts(filters);
            return data;
        },
    });
};