import * as authorizationService from "@server/services/authorization";
import { NextResponse } from "next/server";
import {routeHandlerException} from "@server/utils/exception_utils";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { refreshToken } = body;

        if (!refreshToken) {
            return NextResponse.json({ error: 'Refresh token not provided' }, { status: 400 });
        }

        const tokens = await authorizationService.refreshTokens(refreshToken);

        return NextResponse.json(tokens, { status: 200 });
    } catch (error) {
        return routeHandlerException(error)
    }
}
