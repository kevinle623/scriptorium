import {LoginRequest, LoginResponse} from "@types/dtos/user";
import { CreateUserRequest } from "@/types/dtos/user";

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to log in.");
    }

    return response.json();
};

export const registerUser = async (data: CreateUserRequest) => {
    const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register user.");
    }

    return response.json();
};