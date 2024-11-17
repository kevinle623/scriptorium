import {useMutation} from "@tanstack/react-query";
import {CreateBlogPostRequest, CreateBlogPostResponse} from "@types/dtos/blogPosts";
import {createBlogPost} from "@client/api/services/blogPostService"

export const useCreateBlogPost = () => {
    return useMutation<CreateBlogPostResponse, Error, CreateBlogPostRequest>({
        mutationFn: createBlogPost,
    });
};