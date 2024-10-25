import {NextResponse} from "next/server";
import * as blogPostService from "@server/services/blogPosts"
import {DatabaseIntegrityException, InvalidCredentialsException, ServiceException} from "@server/types/exceptions";
import * as authorizationService from "@server/services/authorization";

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

        await blogPostService.toggleHiddenBlogPost(blogPostId, hidden)
        return NextResponse.json(
            {
                message: "Blog Post hidden status has been updated",
                blogPostId: blogPostId,
                hidden: hidden,
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