export type VoteDto = "up" | "down" | undefined
export enum VoteType {
    UP = "up",
    DOWN = "down",
}

export interface Vote {
    id: number;
    userId: number;
    blogPostId?: number | null;
    commentId?: number | null;
    voteType: VoteType;
}

export interface ToggleVoteRequest {
    id: string;
    voteType: "up" | "down" | null;
}

export interface ToggleVoteResponse {
    message: string;
    vote: {
        id: string;
        userId: string;
        blogPostId: number;
        voteType: "up" | "down";
    } | null;
}