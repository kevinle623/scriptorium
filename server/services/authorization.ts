import {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
} from "@server/utils/jwt_utils";
import {InsufficientPermissionsException, InvalidCredentialsException} from "../types/exceptions";
import {Role} from "@server/types/dtos/roles";
import * as revokedTokenRepository from "@server/repositories/revokedTokens"
import {prisma} from "@server/libs/prisma/client";

export async function verifyAuthorizationHeader(authorizationHeader: string | null) {
    try {
        if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
            return null;
        }

        const token = authorizationHeader.split(" ")[1];

        const revoked = await revokedTokenRepository.isTokenRevoked(prisma, token, 'access');
        if (revoked) {
            throw new InvalidCredentialsException("Token has been revoked.");
        }

        const payload = await verifyAccessToken(token);

        if (!payload) {
            throw new InvalidCredentialsException("Unable to verify token.");
        }

        return payload;
    } catch (error) {
        console.error("verifyAuthorizationHeader", error);
        throw error
    }
}

export function getBearerTokenFromRequest(req: Request) {
    const authorizationHeader = req.headers.get("authorization");
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        return null;
    }
    return authorizationHeader.split(" ")[1];
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

export async function verifyBasicAuthorization(req: Request) {
    const authorizationHeader = req.headers.get("authorization");

    const tokenPayload = await verifyAuthorizationHeader(authorizationHeader);
    return tokenPayload

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

export async function extractUserIdFromRequestHeader(req: Request): Promise<number | undefined> {
    try {
        const authorizationHeader = req.headers.get("authorization");

        if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
            return undefined;
        }

        const token = authorizationHeader.split(" ")[1];

        const payload = await verifyAccessToken(token);

        return payload?.userId ?? undefined;
    } catch (error) {
        console.error("extractUserIdFromRequestHeader error:", error);
        return undefined;
    }
}

export async function refreshTokens(token: string) {
    const revoked = await revokedTokenRepository.isTokenRevoked(prisma, token, 'refresh');
    if (revoked) {
        throw new InvalidCredentialsException("Token has been revoked.");
    }

    const refreshPayload = await verifyRefreshToken(token);

    if (!refreshPayload) {
        throw new InvalidCredentialsException("Unauthorized.");
    }

    const {userId, email, role} = refreshPayload;
    const refreshToken = generateRefreshToken(userId, email, role);
    const accessToken = generateAccessToken(userId, email, role);

    return {
        refreshToken,
        accessToken
    };
}
