import {NextResponse} from "next/server";
import * as blogPostService from "@server/services/blogPosts";
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

        const blogPostId = parseInt(params.id, 10)

        const {
            userId,
            voteType,
        } = await req.json()



        await authorizationService.verifyMatchingUserAuthorization(req, userId)

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

export async function GET(req: Request, {params}: { params: { id: string } }) {
    try {
        const tokenPayload = await authorizationService.verifyBasicAuthorization(req)

        if (!Number(params.id)) {
            return NextResponse.json(
                {message: "Invalid id"},
                {status: 400}
            );
        }

        const { userId } = tokenPayload

        const blogPostId = parseInt(params.id, 10)

        const vote =  await blogPostService.getBlogPostVoteByUserId(userId, blogPostId)

        return NextResponse.json(
            {
                message: "Blog Post vote successfully fetched for user",
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