import {EditUserRequest, EditUserResponse, GetUserResponse, LoginRequest, LoginResponse} from "@/types/dtos/user";
import { CreateUserRequest, RefreshResponse } from "@/types/dtos/user";
import axiosInstance from "@client/api/axiosInstance";

export const getUser = async (): Promise<GetUserResponse> => {
    const { data } = await axiosInstance.get(`/users`);
    return data.user
};

export const getUserById = async (userId: string): Promise<GetUserResponse> => {
    const { data } = await axiosInstance.get(`/users/${userId}`);
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

export async function editUser(request: EditUserRequest): Promise<EditUserResponse> {
    try {
        const response = await axiosInstance.put<EditUserResponse>(`/users`, request, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'Failed to update user.');
        }
        throw new Error('Failed to update user.');
    }
}

export const uploadAvatar = async (formData: FormData) => {
    const response = await axiosInstance.post("/users/avatar", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};
