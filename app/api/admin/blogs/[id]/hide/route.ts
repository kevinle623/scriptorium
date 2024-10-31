import {NextResponse} from "next/server";
import * as blogPostService from "@server/services/blogPosts"
import * as authorizationService from "@server/services/authorization";
import {routeHandlerException} from "@server/utils/exception_utils";

export async function PUT(req: Request, {params}: { params: { id: string } }) {
    try {
        await authorizationService.verifyAdminAuthorization(req)
        if (!Number(params.id)) {
            return NextResponse.json(
                {message: "Invalid id"},
                {status: 400}
            );
        }

        const blogPostId = parseInt(params.id, 10)

        const {
            hidden,
        } = await req.json()

        await blogPostService.toggleHiddenBlogPost(blogPostId, hidden || false)
        return NextResponse.json(
            {
                message: "Blog Post hidden status has been updated",
                blogPostId: blogPostId,
                hidden: hidden,
            },
            {status: 201}
        );
    } catch (error) {
        routeHandlerException(error)
    }
}