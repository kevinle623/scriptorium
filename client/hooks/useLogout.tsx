import {useMutation} from "@tanstack/react-query";
import {useAuth} from "@client/providers/AuthProvider";
import {logoutUser} from "@client/services/userService";

export const useLogout = () => {
    const { clearAuth, getAccessToken, getRefreshToken } = useAuth();

    return useMutation({
        mutationFn: async () => {
            const accessToken = getAccessToken();
            const refreshToken = getRefreshToken();
            if (!accessToken || !refreshToken) {
                throw new Error("Access token or refresh token not available");
            }
            return await logoutUser(accessToken, refreshToken);
        },
        onSuccess: () => {
            clearAuth();
        },
        onError: (error) => {
            console.error("Logout failed:", error.message);
        },
    });
};