import { useMutation } from "@tanstack/react-query";
import {addCommentToBlogPost} from "@client/api/services/blogPostService";

export const useCommentBlogPost = () => {
    return useMutation({
        mutationFn: addCommentToBlogPost,
    });
};