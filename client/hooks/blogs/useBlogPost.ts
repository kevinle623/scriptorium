import { useQuery } from "@tanstack/react-query";
import {fetchBlogPost} from "@client/api/services/blogPostService";
import { BlogPost } from "@/types/dtos/blogPosts";

export const useBlogPost = (id: string): { blogPost: BlogPost | undefined; blogLoading: boolean } => {
    const { data, isLoading: blogLoading } = useQuery<BlogPost>({
        queryKey: ["blogPost", id],
        queryFn: async () => {
            const data = await fetchBlogPost(id);
            return data;
        },
    });

    const blogPost = data as BlogPost

    return { blogPost , blogLoading };
};