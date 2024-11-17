import {NextResponse} from "next/server";
import * as authorizationService from "@server/services/authorization";
import * as userService from "@server/services/users";
import {routeHandlerException} from "@server/utils/exceptionUtils";

export async function GET(req: Request){
    try {
        const { userId } = await authorizationService.verifyBasicAuthorization(req)
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
                    role: user.role,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        return routeHandlerException(error)
    }
}