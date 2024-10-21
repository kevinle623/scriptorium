import {DatabaseIntegrityException} from "../types/exceptions";
import {User as UserModel} from "@prisma/client";

import {CreateUserRequest, User} from "@server/types/dtos/user"

export async function createUser(prismaClient, createUserRequest: CreateUserRequest, hashedPassword: string): Promise<User> {
    try {
        const user = await prismaClient.user.create({
            data: {
                email: createUserRequest.email,
                phone: createUserRequest.phone,
                firstName: createUserRequest.email,
                lastName: createUserRequest.lastName,
                role: createUserRequest.role,
                avatar: createUserRequest.avatar,
                password: hashedPassword,
            }
        })
        return deserializeUser(user)
    } catch (error) {
        console.error("Database Error", error)
        throw new DatabaseIntegrityException('Database error: Failed to create user');
    }
}

export async function findUserByEmail(prismaClient, email: string): Promise<User> {
    try {
        const user = await prismaClient.user.findUnique({
            where: {
                email: email,
            }
        })
        return deserializeUser(user)
    } catch (error) {
        console.error("Database Error", error)
        throw new DatabaseIntegrityException('Database error: Failed to find user');
    }
}

function deserializeUser(user: UserModel): User {
    return {
        id: user.id,
        email: user.email,
        role: user.role,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        phone: user.phone,
    };
}