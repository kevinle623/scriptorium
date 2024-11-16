import { useMutation } from "@tanstack/react-query";
import {addCommentToBlogPost} from "../services/blogPostService";

export const useCommentBlogPost = () => {
    return useMutation({
        mutationFn: addCommentToBlogPost,
    });
};