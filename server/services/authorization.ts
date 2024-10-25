import {generateAccessToken, generateRefreshToken, verifyAccessToken} from "@server/utils/jwt_utils";
import {InsufficientPermissionsException, InvalidCredentialsException} from "../types/exceptions";
import {Role} from "@server/types/dtos/roles";

export async function verifyAuthorizationHeader(authorizationHeader: string) {
    try {
        if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
            return null;
        }

        const token = authorizationHeader.split(" ")[1];
        const payload = verifyAccessToken(token);

        if (!payload) {
            throw new InvalidCredentialsException("Unable to verify token.");
        }

        return payload;
    } catch (error) {
        console.error("verifyAuthorizationHeader", error);
        throw new InvalidCredentialsException("Forbidden");
    }
}

export async function verifyAdminAuthorization(req: Request) {
    const authorizationHeader = req.headers.get("authorization");

    const tokenPayload = await verifyAuthorizationHeader(authorizationHeader);
    if (!tokenPayload) {
        throw new InvalidCredentialsException("Authorization failed. Invalid token.");
    }

    await verifyRole(tokenPayload, Role.ADMIN);

    return tokenPayload
}

export async function verifyMatchingUserAuthorization(req: Request, userId: number) {
    const authorizationHeader = req.headers.get("authorization");

    const tokenPayload = await verifyAuthorizationHeader(authorizationHeader);
    if (!tokenPayload) {
        throw new InvalidCredentialsException("Authorization failed. Invalid token.");
    }

    await verifyMatchingUser(tokenPayload, userId)

    return tokenPayload;
}

export async function verifyRole(tokenPayload: any, requiredRole: Role) {
    if (tokenPayload.role !== requiredRole) {
        throw new InsufficientPermissionsException("Forbidden. Insufficient permissions.");
    }
    return tokenPayload;
}

export async function verifyMatchingUser(tokenPayload: any, userId: number) {
    if (Number(tokenPayload.userId) !== userId) {
        throw new InsufficientPermissionsException("Forbidden. User ID does not match.");
    }
    return tokenPayload;
}

export async function refreshTokens(tokenPayload: any) {
    const {userId, email, role} = tokenPayload;
    const refreshToken = generateRefreshToken(userId, email, role);
    const accessToken = generateAccessToken(userId, email, role);

    return {
        refreshToken,
        accessToken
    };
}
