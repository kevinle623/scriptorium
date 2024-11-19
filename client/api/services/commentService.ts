import {
    AddCommentRequest,
    AddCommentResponse,
    Comment, GetCommentReportsRequest, GetCommentReportsResponse, GetCommentsRequest, GetCommentsResult,
    ReportCommentRequest,
    ReportCommentResponse, UpdateCommentHiddenStatusRequest, UpdateCommentHiddenStatusResponse
} from "@types/dtos/comments";
import axiosInstance from "@client/api/axiosInstance";
import {CommentVoteResponse, ToggleVoteRequest, ToggleVoteResponse} from "@types/dtos/votes";
import {Comment} from "@types/dtos/comments";


export const getCommentById = async (id: string): Promise<Comment> => {
    try {
        const response = await axiosInstance.get<Comment>(`/comments/${id}`);
        return response.data.comment;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message || "Failed to fetch comment.");
        }
        throw new Error("An unexpected error occurred.");
    }
};

export const fetchComments = async (commentId: string): Promise<Comment[]> => {
    const { data } = await axiosInstance.get(`/comments/${commentId}/comment`);
    return data.comments;
};


export const getCommentVotes = async (commentId: number): Promise<CommentVoteResponse> => {
    const { data } = await axiosInstance.get(`/comments/${commentId}/rate`);
    return data;
};

export const reportComment = async (payload: ReportCommentRequest): Promise<ReportCommentResponse> => {
    const {id, reason} = payload
    const response = await axiosInstance.post(`/comments/${id}/report`, { reason });
    return response.data
};

export const voteComment = async (
    payload: ToggleVoteRequest
): Promise<ToggleVoteResponse> => {
    const { commentId, voteType } = payload
    const response = await axiosInstance.post(`/comments/${commentId}/rate`, { voteType });
    return response.data
};

export const deleteComment = async (id: string) => {
    const response = await axiosInstance.delete(`/comments/${id}`);
    return response.data;
};

export const addReplyToComment = async (
    payload: AddCommentRequest
): Promise<AddCommentResponse> => {
    const {id, content} = payload
    const response = await axiosInstance.post(`/comments/${id}/comment`, { content });
    return response.data
};

export const getCommentReports = async (payload: GetCommentReportsRequest): Promise<GetCommentReportsResponse> => {
    const { commentId, page = 1, limit = 10 } = payload;

    const { data } = await axiosInstance.get(`/admin/comments/${commentId}/report`, {
        params: {
            page,
            limit,
        },
    });

    return data;
};

export const updateCommentHiddenStatus = async (
    payload: UpdateCommentHiddenStatusRequest
): Promise<UpdateCommentHiddenStatusResponse> => {
    try {
        const { hidden, commentId } = payload
        const requestBody: UpdateCommentHiddenStatusRequest = { hidden };

        const { data } = await axiosInstance.put<UpdateCommentHiddenStatusResponse>(
            `/admin/comments/${commentId}/hide`,
            requestBody
        );

        return data;
    } catch (error) {
        console.error("Error updating comment hidden status:", error);
        throw new Error("Failed to update comment hidden status");
    }
};

export const getMostReportedComments = async (filters: GetCommentsRequest): Promise<GetCommentsResult> => {
    const { page = 1, limit = 10, hidden = undefined } = filters
    const { data } = await axiosInstance.get(`/admin/comments/`, {
        params: {
            page,
            limit,
            hidden
        },
    });
    return data;
};

