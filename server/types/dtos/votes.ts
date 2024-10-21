export enum VoteType {
    UP = "up",
    DOWN = "down",
}

export interface Vote {
    id: number;
    userId: number;
    blogPostId?: number;
    commentId?: number;
    voteType: VoteType;
}