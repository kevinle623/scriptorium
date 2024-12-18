export const dynamic = 'force-dynamic';
import * as blogPostService from "@server/services/blogPosts";
import {NextResponse} from "next/server";
import * as authorizationService from "@server/services/authorization";
import {GetBlogPostRequest} from "@/types/dtos/blogPosts";
import {routeHandlerException} from "@server/utils/exceptionUtils";

export async function GET(req: Request) {
    try {
        await authorizationService.verifyAdminAuthorization(req)

        const url = new URL(req.url);
        const page = url.searchParams.get('page') ? parseInt(url.searchParams.get('page')!) : undefined;
        const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;
        const hiddenParam = url.searchParams.get('hidden');
        const hidden = hiddenParam === 'true' ? true : hiddenParam === 'false' ? false : undefined;

        const getBlogPostsRequest = {
            page,
            limit,
            hidden,
            orderBy: 'mostReported'
        } as GetBlogPostRequest

        const {totalCount, blogPosts} = await blogPostService.getBlogPosts(getBlogPostsRequest)

        return NextResponse.json(
            {
                message: "Most reported blog posts fetched successfully",
                blogPosts: blogPosts,
                totalCount: totalCount,
            },
            {status: 201}
        );
    } catch (error) {
        return routeHandlerException(error)
    }
}