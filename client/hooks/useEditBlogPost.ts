import {editBlogPost} from "@client/api/services/blogPostService";
import {useMutation} from "@tanstack/react-query";
import {BlogPost, EditBlogPostRequest} from "@/types/dtos/blogPosts";

export const useEditBlogPost = () => {
    return useMutation<BlogPost, Error, EditBlogPostRequest>({
        mutationFn: editBlogPost,
    });
};