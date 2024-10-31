import { NextResponse } from "next/server";
import * as userService from "@server/services/users";
import * as authorizationService from "@server/services/authorization"
import {routeHandlerException} from "@server/utils/exception_utils";

export async function POST(req: Request) {
    try {
        const accessToken = authorizationService.getBearerTokenFromRequest(req)
        const { refreshToken } = await req.json();

        if (!accessToken || !refreshToken) {
            return NextResponse.json(
                { message: "Access token or refresh token not provided" },
                { status: 400 }
            );
        }
        await userService.logoutUser(accessToken, refreshToken);
        return NextResponse.json({message: "Logged out successfully"}, { status: 200 });
    } catch (error) {
        routeHandlerException(error)
    }
}