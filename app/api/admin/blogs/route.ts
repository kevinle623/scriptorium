import {DatabaseIntegrityException, InvalidCredentialsException, ServiceException} from "@server/types/exceptions";
import * as blogPostService from "@server/services/blogPosts";
import {NextResponse} from "next/server";
import * as authorizationService from "@server/services/authorization";

export async function GET(req: Request) {
    try {
        await authorizationService.verifyAdminAuthorization(req)
        const url = new URL(req.url);
        const page = url.searchParams.get('page') ? parseInt(url.searchParams.get('page')!) : undefined;
        const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;

        const {totalCount, blogPosts} = await blogPostService.getMostReportedBlogPosts(page, limit)

        return NextResponse.json(
            {
                message: "Most reported blog posts fetched successfully",
                blogPosts: blogPosts,
                totalCount: totalCount,
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