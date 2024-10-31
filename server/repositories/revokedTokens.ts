import { PrismaClient, RevokedToken as RevokedTokenModel } from "@prisma/client";
import { DatabaseIntegrityException } from "@server/types/exceptions";
import {TokenType} from "@server/types/dtos/tokens";

export async function revokeToken(
    prismaClient: PrismaClient,
    token: string,
    tokenType: TokenType,
): Promise<RevokedTokenModel> {
    try {
        return await prismaClient.revokedToken.create({
            data: {
                token,
                tokenType,
            },
        });
    } catch (e) {
        console.error("Database error: ", e);
        throw new DatabaseIntegrityException("Database error: failed to create revoked token");
    }
}

export async function isTokenRevoked(
    prismaClient: PrismaClient,
    token: string,
    tokenType: TokenType,
): Promise<boolean> {
    try {
        const revokedToken = await prismaClient.revokedToken.findUnique({
            where: { token, tokenType },
        });
        return revokedToken !== null;
    } catch (e) {
        console.error("Database error: ", e);
        throw new DatabaseIntegrityException("Database error: failed to check revoked token");
    }
}

export async function cleanUpExpiredTokens(
    prismaClient: PrismaClient
): Promise<void> {
    try {
        const now = new Date();
        await prismaClient.revokedToken.deleteMany({
            where: {
                createdAt: { lte: now },
            },
        });
    } catch (e) {
        console.error("Database error: ", e);
        throw new DatabaseIntegrityException("Database error: failed to clean up expired tokens");
    }
}
