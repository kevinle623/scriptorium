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
            reason,
        } = await req.json()

        const report =  await blogPostService.reportBlogPost(userId, blogPostId, reason)
        return NextResponse.json(
            {
                message: "Blog Post successfully reported",
                report: {
                    id: report.id,
                    userId: report.userId,
                    blogPostId: report.blogPostId,
                    reason: report.reason,
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