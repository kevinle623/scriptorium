import * as userRepository from '@server/repositories/users'
import {InvalidCredentialsException, NotFoundException, ServiceException} from "../types/exceptions";
import {prisma} from "@server/libs/prisma/client";
import {comparePassword, hashPassword} from "@server/utils/password_utils";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
} from "@server/utils/jwt_utils";
import {CreateUserRequest, EditUserRequest} from "@server/types/dtos/user";
import * as revokedTokenRepository from '@server/repositories/revokedTokens'

export async function registerUser(createUserRequest: CreateUserRequest) {
    try {
        const existingUser = await userRepository.findUserByEmail(prisma, createUserRequest.email)
        if (existingUser) {
            throw new ServiceException("Username already exists")
        }
        const hashedPassword = await hashPassword(createUserRequest.password)

        const user = await userRepository.createUser(prisma, createUserRequest, hashedPassword);
        return user;
    } catch (error) {
        throw error
    }
}

export async function loginUser(email: string, password: string) {
    try {
        const user = await userRepository.findUserByEmail(prisma, email)

        if (!user) {
            throw new InvalidCredentialsException("Unauthorized")
        }

        const isMatchingPassword = await comparePassword(password, user.password)

        if (!isMatchingPassword) {
            throw new InvalidCredentialsException("Unauthorized")
        }

        const accessToken = generateAccessToken(user.id, user.email, user.role)
        const refreshToken = generateRefreshToken(user.id, user.email, user.role)

        return {
            accessToken,
            refreshToken
        }
    } catch (error) {
        throw error
    }
}

export async function getUserById(userId: number) {
    try {
        const user = await userRepository.findUserById(prisma, userId)

        if (!user) {
            throw new NotFoundException("User not found")
        }
        return user
    } catch (e) {
        throw e
    }
}

export async function editUser(editUserRequest: EditUserRequest){
    try {
        const user = await userRepository.findUserById(prisma, editUserRequest.userId)
        if (!user) {
            throw new NotFoundException("User not found")
        }
        await userRepository.updateUser(prisma, editUserRequest)
        const updatedUser = await userRepository.findUserById(prisma, editUserRequest.userId)
        return updatedUser
    } catch (error) {
        throw error
    }
}

export async function logoutUser(accessToken: string, refreshToken: string) {
    try {
        const accessTokenPayload = verifyAccessToken(accessToken)
        const refreshTokenPayload = verifyRefreshToken(refreshToken);
        if (!accessTokenPayload || !refreshTokenPayload) {
            throw new InvalidCredentialsException("Invalid or expired tokens.");
        }

        if (!await revokedTokenRepository.isTokenRevoked(prisma, accessToken, 'access')) {
            await revokedTokenRepository.revokeToken(prisma, accessToken, 'access');
        }
        if (!await revokedTokenRepository.isTokenRevoked(prisma, refreshToken, 'refresh')) {
            await revokedTokenRepository.revokeToken(prisma, refreshToken, 'refresh');
        }

        return;
    } catch (error) {
        throw error;
    }
}