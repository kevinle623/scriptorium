import { NextResponse } from "next/server";
import * as userService from "@server/services/users";
import {routeHandlerException} from "@server/utils/exception_utils";

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
        routeHandlerException(error)
    }
}