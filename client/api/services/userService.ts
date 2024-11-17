import {GetUserResponse, LoginRequest, LoginResponse} from "@types/dtos/user";
import { CreateUserRequest, RefreshResponse } from "@types/dtos/user";
import axiosInstance from "@client/api/axiosInstance";

export const getUser = async (): Promise<GetUserResponse> => {
    const { data } = await axiosInstance.get(`/users`);
    return data.user
};

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post("/users/login", data, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    return response.data;
};

export const registerUser = async (data: CreateUserRequest) => {
    const response = await axiosInstance.post("/users/register", data, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    return response.data;
};

export const logoutUser = async (accessToken: string, refreshToken: string) => {
    const response = await axiosInstance.post(
        "/users/logout",
        { refreshToken },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    return response.data;
};

export const refreshUser = async (refreshToken: string) => {
    const { data } = await axiosInstance.post<RefreshResponse>("/users/refresh", { refreshToken });
    return data;
};
