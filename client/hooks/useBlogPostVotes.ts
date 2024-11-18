import {getBlogPostVotes} from "@client/api/services/blogPostService";
import {useQuery} from "@tanstack/react-query";

export const useBlogPostVotes = (blogPostId: number) => {
    return useQuery({
        queryKey: ["blogPostVotes", blogPostId],
        queryFn: () => getBlogPostVotes(blogPostId),
        enabled: !!blogPostId,
    });
};