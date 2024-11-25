import axios from "axios";
import { refreshUser } from "@client/api/services/userService"
import {
    getAccessToken,
    getRefreshToken,
    setAccessToken,
    setRefreshToken,
    clearTokens,
} from "@client/utils/tokenUtils";

const axiosInstance = axios.create({
    baseURL: "/api",
    timeout: 5000,
});

axiosInstance.interceptors.request.use(
    (config) => {
        if (!config.headers?.skipAuth && !config.headers?.Authorization) {
            const accessToken = getAccessToken();
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                const refreshToken = getRefreshToken();
                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                const originalRequest = error.config;
                if (originalRequest?.url?.includes('/refresh')) {
                    clearTokens();
                    return Promise.reject(error);
                }

                const { accessToken, refreshToken: newRefreshToken } = await refreshUser(refreshToken);
                setAccessToken(accessToken);
                setRefreshToken(newRefreshToken)

                error.config.headers.Authorization = `Bearer ${accessToken}`;
                return axiosInstance.request(error.config);
            } catch (refreshError) {
                console.error("Failed to refresh token:", refreshError);
                clearTokens()
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
