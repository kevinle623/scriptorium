import {NextResponse} from "next/server";
import * as blogPostService from "@server/services/blogPosts";
import {DatabaseIntegrityException, InvalidCredentialsException, ServiceException} from "@server/types/exceptions";

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

        const vote =  await blogPostService.toggleBlogPostVote(userId, blogPostId, voteType)
        return NextResponse.json(
            {
                message: "Blog Post vote toggle successfully applied",
                vote: {
                    id: vote?.id,
                    userId: vote?.userId,
                    blogPostId: vote?.blogPostId,
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