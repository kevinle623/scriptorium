import {
    AddCommentRequest,
    AddCommentResponse,
    Comment,
    GetCommentReportsRequest,
    GetCommentReportsResponse,
    GetCommentResponse,
    GetCommentsRequest,
    GetCommentsResult,
    ReportCommentRequest,
    ReportCommentResponse,
    UpdateCommentHiddenStatusRequest,
    UpdateCommentHiddenStatusResponse
} from "@/types/dtos/comments";
import axiosInstance from "@client/api/axiosInstance";
import {CommentVoteResponse, ToggleVoteRequest, ToggleVoteResponse} from "@/types/dtos/votes";
import {AxiosError} from "axios";


export const getCommentById = async (id: string): Promise<Comment> => {
    try {
        const response = await axiosInstance.get<GetCommentResponse>(`/comments/${id}`);
        return response.data.comment;
    } catch (error) {
        const axiosError = error as AxiosError<{error: string}>;
        throw new Error(axiosError.response?.data?.error || "Failed to fetch comment.");
    }
};

export const fetchComments = async (payload: GetCommentsRequest): Promise<GetCommentsResult> => {
    const { page, limit, commentId } = payload
    const { data } = await axiosInstance.get(`/comments/${commentId}/comment`, {
        params: {
            page,
            limit
        }
    });
    return data;
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

        const { data } = await axiosInstance.put<UpdateCommentHiddenStatusResponse>(
            `/admin/comments/${commentId}/hide`,
            {
                hidden
            }
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

