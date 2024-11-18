import {NextResponse} from "next/server";
import * as blogPostService from "@server/services/blogPosts";
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

        const blogPostId = parseInt(params.id, 10)

        const {
            voteType,
        } = await req.json()

        const { userId }= await authorizationService.verifyBasicAuthorization(req)

        const vote =  await blogPostService.toggleBlogPostVote(userId, blogPostId, voteType || null)
        return NextResponse.json(
            {
                message: "Blog Post vote toggle successfully applied",
                vote: vote ? {
                    id: vote?.id,
                    userId: vote?.userId,
                    blogPostId: vote?.blogPostId,
                    voteType: vote?.voteType
                } : null
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

        const blogPostId = parseInt(params.id, 10)

        const {userVote: vote, upVotes, downVotes} =  await blogPostService.getBlogPostVoteByUserId(userId, blogPostId)

        return NextResponse.json(
            {
                message: "Blog Post vote successfully fetched for user",
                userVote: vote ? {
                    id: vote?.id,
                    userId: vote?.userId,
                    blogPostId: vote?.blogPostId,
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