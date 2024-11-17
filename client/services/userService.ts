import { LoginRequest, LoginResponse } from "@types/dtos/user";
import { CreateUserRequest } from "@/types/dtos/user";
import axios from "axios";

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axios.post("/api/users/login", data, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    return response.data;
};

export const registerUser = async (data: CreateUserRequest) => {
    const response = await axios.post("/api/users/register", data, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    return response.data;
};

export const logoutUser = async (accessToken: string, refreshToken: string) => {
    const response = await axios.post(
        "/api/users/logout",
        { refreshToken },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    return response.data;
};
