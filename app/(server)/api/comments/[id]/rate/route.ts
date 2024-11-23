import {NextResponse} from "next/server";
import * as commentService from "@server/services/comments";
import * as authorizationService from "@server/services/authorization";
import {routeHandlerException} from "@server/utils/exceptionUtils";

export async function POST(req: Request, {params}: { params: { id: string } }) {
    try {
        if (!Number(params.id)) {
            return NextResponse.json(
                {message: "Invalid id"},
                {status: 400}
            );
        }
        const commentId = parseInt(params.id, 10)

        const {
            voteType,
        } = await req.json()

        const { userId } = await authorizationService.verifyBasicAuthorization(req)

        const vote =  await commentService.toggleCommentVote(userId, commentId, voteType)
        return NextResponse.json(
            {
                message: "Comment vote toggle successfully applied",
                vote: {
                    id: vote?.id,
                    userId: vote?.userId,
                    commentId: vote?.commentId,
                    voteType: vote?.voteType
                }
            },
            {status: 201}
        );
    } catch (error) {
        return routeHandlerException(error)
    }
}

export async function GET(req: Request, {params}: { params: { id: string } }) {
    try {
        if (!Number(params.id)) {
            return NextResponse.json(
                {message: "Invalid id"},
                {status: 400}
            );
        }

        const userId = await authorizationService.extractUserIdFromRequestHeader(req) || null

        const commentId = parseInt(params.id, 10)

        const { userVote: vote, upVotes, downVotes}  =  await commentService.getCommentVoteByUserId(userId, commentId)

        return NextResponse.json(
            {
                message: "Comment vote successfully fetched for user",
                userVote: vote ? {
                    id: vote?.id,
                    userId: vote?.userId,
                    commentId: vote?.commentId,
                    voteType: vote?.voteType
                } : null,
                upVotes: upVotes || 0,
                downVotes: downVotes || 0,
            },
            {status: 201}
        );

    } catch (error) {
        return routeHandlerException(error)
    }
}