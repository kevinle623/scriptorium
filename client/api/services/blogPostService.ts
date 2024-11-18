
import {
    BlogPost,
    BlogPostFilters,
    CreateBlogPostRequest, CreateBlogPostResponse, EditBlogPostRequest,
    ReportBlogPostRequest,
    ReportBlogPostResponse
} from "@types/dtos/blogPosts";
import {AddCommentRequest, AddCommentResponse, Comment} from "@types/dtos/comments"
import {BlogPostVoteResponse, ToggleVoteRequest, ToggleVoteResponse} from "@types/dtos/votes";
import axiosInstance from "@client/api/axiosInstance";

export const fetchBlogPosts = async (filters: BlogPostFilters): Promise<{
    blogPosts: BlogPost[];
    totalCount: number;
}> => {
    try {
        const { data } = await axiosInstance.get("/blogs", {
            params: filters
        });

        return {
            blogPosts: data.blogPosts,
            totalCount: data.totalCount,
        };
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        throw new Error("Failed to fetch blog posts.");
    }
};

export const createBlogPost = async (data: CreateBlogPostRequest): Promise<CreateBlogPostResponse> => {
    const response = await axiosInstance.post("/blogs", data, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    return response.data;
};

export const fetchBlogPost = async (id: string): Promise<BlogPost> => {
    const { data } = await axiosInstance.get(`/blogs/${id}`);
    return data.blogPost;
};

export const fetchComments = async (blogPostId: string): Promise<Comment[]> => {
    const { data } = await axiosInstance.get(`/blogs/${blogPostId}/comment`);
    return data.comments;
};

export const voteBlogPost = async (
    payload: ToggleVoteRequest
): Promise<ToggleVoteResponse> => {
    const { blogPostId, voteType } = payload
    const response = await axiosInstance.post(`/blogs/${blogPostId}/rate`, { voteType });
    return response.data
};

export const editBlogPost = async (editBlogPostRequest: EditBlogPostRequest): Promise<BlogPost> => {
    const { blogPostId, ...payload } = editBlogPostRequest;
    const response = await axiosInstance.put(`/blogs/${blogPostId}`, payload);
    return response.data.blogPost;
};


export const deleteBlogPost = async (id: string) => {
    const response = await axiosInstance.delete(`/blogs/${id}`);
    return response.data;
};

export const addCommentToBlogPost = async (
    payload: AddCommentRequest
): Promise<AddCommentResponse> => {
    const {id, content} = payload
    const response = await axiosInstance.post(`/blogs/${id}/comment`, { content });
    return response.data
};

export const reportBlogPost = async (payload: ReportBlogPostRequest): Promise<ReportBlogPostResponse> => {
    const {id, reason, userId} = payload
    const response = await axiosInstance.post(`/blogs/${id}/report`, { reason, userId });
    return response.data
};

export const getBlogPostVotes = async (blogPostId: number): Promise<BlogPostVoteResponse> => {
    const { data } = await axiosInstance.get(`/blogs/${blogPostId}/rate`);
    return data;
};
