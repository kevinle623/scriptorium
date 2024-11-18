import {Comment, ReportCommentRequest, ReportCommentResponse} from "@types/dtos/comments";
import axiosInstance from "@client/api/axiosInstance";
import {CommentVoteResponse, ToggleVoteRequest, ToggleVoteResponse} from "@types/dtos/votes";


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