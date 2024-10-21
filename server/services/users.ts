import * as userRepository from '@server/repositories/users'
import {InvalidCredentialsException, UserException} from "../types/exceptions";
import {prisma} from "@server/libs/prisma/client";
import {comparePassword, hashPassword} from "@server/utils/password_utils";
import {generateAccessToken, generateRefreshToken } from "@server/utils/jwt_utils";
import {CreateUserRequest} from "@server/types/dtos/user";

export async function registerUser(createUserRequest: CreateUserRequest) {
    try {
        const existingUser = await userRepository.findUserByEmail(prisma, createUserRequest.email)
        if (existingUser) {
            throw new UserException("Username already exists")
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