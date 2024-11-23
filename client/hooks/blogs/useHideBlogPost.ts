import {useMutation} from "@tanstack/react-query";
import {ToggleBlogPostHiddenStatusRequest, ToggleBlogPostHiddenStatusResponse} from "@/types/dtos/blogPosts";
import {updateBlogPostHiddenStatus} from "@client/api/services/blogPostService";

export const useHideBlogPost = () => {
    return useMutation<
        ToggleBlogPostHiddenStatusResponse,
        Error,
        ToggleBlogPostHiddenStatusRequest
    >({
        mutationFn: updateBlogPostHiddenStatus
    });
};