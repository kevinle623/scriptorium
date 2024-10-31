import { DatabaseIntegrityException, InvalidCredentialsException } from "@server/types/exceptions";
import * as authorizationService from "@server/services/authorization";
import { NextResponse } from "next/server";

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
        if (error instanceof DatabaseIntegrityException) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        } else if (error instanceof InvalidCredentialsException) {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
