import { NextResponse } from "next/server";
import * as userService from "@server/services/users";
import {
    DatabaseIntegrityException,
    InvalidCredentialsException,
    UserException,
} from "@server/types/exceptions";
import {Role} from "@server/types/dtos/roles";
import {CreateUserRequest} from "@server/types/dtos/user";

export async function POST(req: Request) {
    try {
        const { email, phone, firstName, lastName, password, role, avatar } = await req.json()

        if (!email || !phone || !password || !firstName || !lastName || !role) {
            return NextResponse.json(
                { message: "Not all required fields provided to register the user" },
                { status: 400 }
            );
        }

        if (role !== Role.ADMIN || role !== Role.USER) {
            return NextResponse.json(
                { message: "Invalid user role" },
                { status: 400 }
            );
        }

        const createUserRequest: CreateUserRequest = {
            email, phone, firstName, lastName, password, role, avatar
        }

        const user = await userService.registerUser(createUserRequest);

        return NextResponse.json(
            {
                message: "User registered successfully",
                user: {
                    id: user.id,
                    email: user.email,
                    phone: user.phone,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    avatar: user.avatar,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof DatabaseIntegrityException) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        } else if (error instanceof InvalidCredentialsException) {
            return NextResponse.json({ error: error.message }, { status: 401 });
        } else if (error instanceof UserException) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}