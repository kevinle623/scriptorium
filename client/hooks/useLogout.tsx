import {useMutation, useQueryClient} from "@tanstack/react-query";
import { useAuth } from "@client/providers/AuthProvider";
import { useToaster } from "@client/providers/ToasterProvider";
import { logoutUser } from "@client/api/services/userService";

export const useLogout = () => {
    const queryClient = useQueryClient();
    const { clearAuth, getAccessToken, getRefreshToken } = useAuth();
    const { setToaster } = useToaster();

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
            queryClient.invalidateQueries();
            clearAuth();
            setToaster("Logged out successfully", "success");
        },
        onError: (error: any) => {
            console.error("Logout failed:", error.message);
            setToaster(error.message || "Failed to log out", "error");
        },
    });
};
