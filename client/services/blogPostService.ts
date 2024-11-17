import axios from "axios";
import {
    BlogPost,
    BlogPostFilters,
    CreateBlogPostRequest, CreateBlogPostResponse,
    ReportBlogPostRequest,
    ReportBlogPostResponse
} from "@types/dtos/blogPosts";
import {AddCommentRequest, AddCommentResponse, Comment} from "@types/dtos/comments"
import {ToggleVoteRequest, ToggleVoteResponse} from "@types/dtos/votes";

export const fetchBlogPosts = async (filters: BlogPostFilters): Promise<{
    blogPosts: BlogPost[];
    totalCount: number;
}> => {
    try {
        const { data } = await axios.get("/api/blogs", {
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
    const response = await axios.post("/api/blogs", data, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    return response.data;
};

export const fetchBlogPost = async (id: string): Promise<BlogPost> => {
    const { data } = await axios.get(`/api/blogs/${id}`);
    return data.blogPost;
};

export const fetchComments = async (blogPostId: string): Promise<Comment[]> => {
    const { data } = await axios.get(`/api/blogs/${blogPostId}/comments`);
    return data.comments;
};

export const voteBlogPost = async (
    payload: ToggleVoteRequest
): Promise<ToggleVoteResponse> => {
    const { id, type, userId} = payload
    const response = await axios.post(`/api/blogs/${id}/rate`, { type, userId });
    return response.data
};

export const addCommentToBlogPost = async (
    payload: AddCommentRequest
): Promise<AddCommentResponse> => {
    const {id, content, userId} = payload
    const response = await axios.post(`/api/blogs/${id}/comments`, { content, userId });
    return response.data
};

export const reportBlogPost = async (payload: ReportBlogPostRequest): Promise<ReportBlogPostResponse> => {
    const {id, reason, userId} = payload
    const response = await axios.post(`/api/blogs/${id}/report`, { reason, userId });
    return response.data
};
