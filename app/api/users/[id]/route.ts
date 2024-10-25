import {
    DatabaseIntegrityException,
    InvalidCredentialsException,
    ServiceException
} from "@server/types/exceptions";
import {NextResponse} from "next/server";

import * as userService from "@server/services/users"
import * as authorizationService from "@server/services/authorization"


export async function GET(req: Request, { params }: { params: { id: string }}){
    try {
        if (!Number(params.id)) {
            return NextResponse.json(
                { message: "Invalid id" },
                { status: 400 }
            );
        }
        const userId = parseInt(params.id, 10)

        await authorizationService.verifyMatchingUserAuthorization(req, userId)

        const user = await userService.getUserById(userId)
        return NextResponse.json(
            {
                message: "User fetched successfully",
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
        } else if (error instanceof ServiceException) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


export async function PUT(req: Request, { params }: { params: { id: string }}) {
    try {
        if (!Number(params.id)) {
            return NextResponse.json(
                { message: "Invalid id" },
                { status: 400 }
            );
        }
        const userId = parseInt(params.id, 10)
        await authorizationService.verifyMatchingUserAuthorization(req, userId)

        const { email, phone, firstName, lastName, avatar } = await req.json()

        if (!email && !phone && !firstName && !lastName && !avatar) {
            return NextResponse.json(
                { message: "Nothing to update" },
                { status: 400 }
            );
        }

        const editUserRequest = {
            userId,
            email,
            phone,
            firstName,
            lastName,
            avatar,
        }

        const user = await userService.editUser(editUserRequest)
        return NextResponse.json(
            {
                message: "User updated successfully",
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
        } else if (error instanceof ServiceException) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }



}