import {NextResponse} from "next/server";
import * as commentService from "@server/services/comments";
import {DatabaseIntegrityException, InvalidCredentialsException, ServiceException} from "@server/types/exceptions";
import * as authorizationService from "@server/services/authorization";

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
            userId,
            voteType,
        } = await req.json()

        await authorizationService.verifyMatchingUserAuthorization(req, userId)

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
        if (error instanceof DatabaseIntegrityException) {
            return NextResponse.json({error: error.message}, {status: 400});
        } else if (error instanceof InvalidCredentialsException) {
            return NextResponse.json({error: error.message}, {status: 401});
        } else if (error instanceof ServiceException) {
            return NextResponse.json({error: error.message}, {status: 400});
        }
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}