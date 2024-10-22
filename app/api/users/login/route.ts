import { NextResponse } from "next/server";
import * as userService from "@server/services/users";
import {
    DatabaseIntegrityException,
    InvalidCredentialsException,
    ServiceException,
} from "@server/types/exceptions";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) {
            return NextResponse.json(
                { message: "Username and password are required" },
                { status: 400 }
            );
        }

        const tokens = await userService.loginUser(email, password);
        return NextResponse.json(tokens, { status: 200 });
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