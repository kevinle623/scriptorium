import {generateAccessToken, generateRefreshToken, verifyAccessToken} from "@server/utils/jwt_utils";
import {InsufficientPermissionsException, InvalidCredentialsException} from "../types/exceptions";
import {Role} from "@server/types/dtos/roles";

export async function verifyAuthorizationHeader(authorizationHeader) {
    try {
        if (!authorizationHeader || !authorizationHeader?.startsWith("Bearer ")) {
            return null
        }

        const token = authorizationHeader.split(" ")[1];

        const payload = verifyAccessToken(token);
        return payload;
    } catch (error) {
        console.error("verifyAuthorizationHeader", error)
        throw new InvalidCredentialsException("Forbidden");
    }
}

export async function verifyRole(tokenPayload, requiredRole: Role) {
    if (tokenPayload.role !== requiredRole) {
        throw new InsufficientPermissionsException("Forbidden");
    }
    return tokenPayload
}

export async function refreshTokens(tokenPayload){
    const {userId, username, role} = tokenPayload
    const refreshToken = generateRefreshToken(userId, username, role)
    const accessToken = generateAccessToken(userId, username, role)

    return {
        refreshToken,
        accessToken
    }
}