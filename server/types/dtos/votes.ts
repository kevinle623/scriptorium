import {Report} from "@server/types/dtos/reports";

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