import {Role} from "@/types/dtos/roles";

export interface User {
    id: number;
    email: string;
    phone: string;
    role: Role;
    firstName: string;
    lastName: string;
    password: string;
    avatar?: string;

}

export interface CreateUserRequest {
    email: string;
    phone: string;
    role: Role;
    firstName: string;
    lastName: string;
    password: string;
    avatar?: string;
}

export interface EditUserRequest {
    userId: number,
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
}

export interface EditUserResponse {
    message: string;
    user: {
        id: number;
        email?: string;
        phone?: string;
        firstName?: string;
        lastName?: string;
        avatar?: string;
    };
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: Role,
    };
}

export interface RegisterResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: Role,
    };
}

export interface RefreshResponse {
    accessToken: string;
    refreshToken: string;
}

export interface GetUserRequest {
    userId: string
}


export interface GetUserResponse {
    id: number;
    email: string;
    phone: string;
    role: Role;
    firstName: string;
    lastName: string;
    avatar?: string;
}