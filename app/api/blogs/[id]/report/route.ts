import {NextResponse} from "next/server";
import * as blogPostService from "@server/services/blogPosts";
import {routeHandlerException} from "@server/utils/exception_utils";

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
        return routeHandlerException(error)
    }
}