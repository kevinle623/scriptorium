export type VoteDto = "UP" | "DOWN" | undefined
export enum VoteType {
    UP = "UP",
    DOWN = "DOWN",
}

export interface Vote {
    id: number;
    userId: number;
    blogPostId?: number | null;
    commentId?: number | null;
    voteType: VoteType;
}

export interface ToggleVoteRequest {
    id?: string;
    voteType: VoteType | null;
    blogPostId?: number | string;
    commentId?: number | string;
}

export interface ToggleVoteResponse {
    message: string;
    vote: {
        id: string;
        userId: string;
        commentId?: number;
        blogPostId?: number;
        voteType: "up" | "down";
    } | null;
}

export interface BlogPostVoteResponse {
    userVote: Vote | null;
    upVotes: number;
    downVotes: number;
}

export interface CommentVoteResponse {
    userVote: Vote | null;
    upVotes: number;
    downVotes: number;
}
