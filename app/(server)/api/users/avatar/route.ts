import { NextResponse } from "next/server";
import * as userService from "@server/services/users";
import * as authorizationService from "@server/services/authorization";
import { routeHandlerException } from "@server/utils/exceptionUtils";

export async function POST(request: Request) {
    try {
        const { userId } = await authorizationService.verifyBasicAuthorization(request);

        const formData = await request.formData();
        const file = formData.get("avatar") as File;

        if (!file) {
            throw new Error("File is missing");
        }
        console.log(file);


        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        const avatarUrl = await userService.uploadAvatar(userId, file);

        return NextResponse.json(
            {
                message: "Avatar successfully updated",
                avatar: avatarUrl,
            },
            { status: 200 }
        );
    } catch (error) {
        return routeHandlerException(error);
    }
}
