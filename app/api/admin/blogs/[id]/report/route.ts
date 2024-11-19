import {NextResponse} from "next/server";
import * as authorizationService from "@server/services/authorization";
import * as blogPostService from "@server/services/blogPosts"
import {routeHandlerException} from "@server/utils/exceptionUtils";

export async function GET(req: Request, {params}: { params: { id: string } }) {
    try {
        if (!Number(params.id)) {
            return NextResponse.json(
                {message: "Invalid id"},
                {status: 400}
            );
        }

        const url = new URL(req.url);
        const page = url.searchParams.get('page') ? parseInt(url.searchParams.get('page')!) : undefined;
        const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;

        await authorizationService.verifyAdminAuthorization(req)

        const blogPostId = parseInt(params.id, 10)

        const getReportsForBlogPostRequest = {
            blogPostId,
            page: page || 1,
            limit: limit || 10,
        }

        const { reports, totalCount }  =  await blogPostService.getReportsForBlogPost(getReportsForBlogPostRequest)

        return NextResponse.json(
            {
                message: "Reports for the blog posts have been successfully fetched",
                reports,
                totalCount,
            },
            {status: 201}
        );

    } catch (error) {
        return routeHandlerException(error)
    }
}