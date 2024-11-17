import { NextResponse } from "next/server";
import * as userService from "@server/services/users";
import {Role} from "@/types/dtos/roles";
import {CreateUserRequest} from "@/types/dtos/user";
import {routeHandlerException} from "@server/utils/exceptionUtils";

export async function POST(req: Request) {
    try {
        const { email, phone, firstName, lastName, password, role, avatar } = await req.json()

        if (!email || !phone || !password || !firstName || !lastName || !role) {
            return NextResponse.json(
                { message: "Not all required fields provided to register the user" },
                { status: 400 }
            );
        }

        if (role != Role.ADMIN && role != Role.USER) {
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
        return routeHandlerException(error)
    }
}