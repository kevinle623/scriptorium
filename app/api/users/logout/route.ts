import { NextResponse } from "next/server";
import * as userService from "@server/services/users";
import * as authorizationService from "@server/services/authorization"
import {
    DatabaseIntegrityException,
    InvalidCredentialsException,
    ServiceException,
} from "@server/types/exceptions";

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
        if (error instanceof DatabaseIntegrityException) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        } else if (error instanceof ServiceException) {
            return NextResponse.json({ error: error.message }, { status: 401 });
        } else if (error instanceof InvalidCredentialsException) {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }

        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}