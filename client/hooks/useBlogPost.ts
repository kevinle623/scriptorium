import { useQuery } from "@tanstack/react-query";
import {fetchBlogPost} from "@client/api/services/blogPostService";
import { BlogPost } from "@types/dtos/blogPosts";

export const useBlogPost = (id: string) => {
    const { data: blogPost, isLoading: blogLoading } =  useQuery<BlogPost>({
        queryKey: ["blogPost", id],
        queryFn: async () => {
            const data = await fetchBlogPost(id);
            return data;
        },
    });
    return { blogPost, blogLoading };
};