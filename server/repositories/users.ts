import {DatabaseIntegrityException} from "@/types/exceptions";
import {User as UserModel} from "@prisma/client";
import {Role} from "@/types/dtos/roles"

import {CreateUserRequest, EditUserRequest, User} from "@/types/dtos/user"

export async function createUser(prismaClient: any, createUserRequest: CreateUserRequest, hashedPassword: string): Promise<User> {
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
        }) as UserModel
        return deserializeUser(user)
    } catch (error) {
        console.error("Database Error", error)
        throw new DatabaseIntegrityException('Database error: Failed to create user');
    }
}

export async function findUserById(prismaClient: any, userId: number): Promise<User> {
    try {
        const user = await prismaClient.user.findUnique({
            where: {
                id: userId,
            }
        }) as UserModel
        return deserializeUser(user)
    } catch (error) {
        console.error("Database Error", error)
        throw new DatabaseIntegrityException('Database error: Failed to find user');
    }
}

export async function findUserByEmail(prismaClient: any, email: string): Promise<User | null> {
    try {
        const user = await prismaClient.user.findUnique({
            where: {
                email: email,
            }
        }) as UserModel

        if (!user) return null
        return deserializeUser(user)
    } catch (error) {
        console.error("Database Error", error)
        throw new DatabaseIntegrityException('Database error: Failed to find user');
    }
}

export async function updateUser(prismaClient: any, editUserRequest: EditUserRequest): Promise<void> {
    try {
        const existingUser = await prismaClient.user.findUnique({
            where: { id: editUserRequest.userId },
        }) as UserModel;

        if (!existingUser) {
            throw new Error('User not found');
        }

        await prismaClient.user.update({
            where: { id: editUserRequest.userId },
            data: {
                email: editUserRequest.email ?? existingUser.email,
                firstName: editUserRequest.firstName ?? existingUser.firstName,
                lastName: editUserRequest.lastName ?? existingUser.lastName,
                avatar: editUserRequest.avatar ?? existingUser.avatar,
                phone: editUserRequest.phone ?? existingUser.phone,
            },
        });
        return
    } catch (error) {
        console.error('Database Error', error);
        throw new DatabaseIntegrityException('Database error: Failed to edit user');
    }
}

function deserializeUser(user: UserModel): User {
    return {
        id: user.id,
        email: user.email,
        role: (user.role as Role),
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar || undefined,
        phone: user.phone,
    };
}