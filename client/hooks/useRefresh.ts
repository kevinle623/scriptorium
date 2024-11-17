import { useMutation } from "@tanstack/react-query";
import { refreshUser } from "@client/api/services/userService";
import { useAuth } from "@client/providers/AuthProvider";
import { useToaster } from "@client/providers/ToasterProvider";
import {useRouter} from "next/navigation";

export const useRefresh = () => {
    const { navigate } = useRouter()
    const { setAccessToken, setRefreshToken, clearAuth } = useAuth();
    const { setToaster } = useToaster();

    return useMutation({
        mutationFn: (refreshToken: string) => refreshUser(refreshToken),
        onSuccess: ({ accessToken, refreshToken }) => {
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            setToaster("Tokens refreshed successfully", "success");
        },
        onError: (error) => {
            console.error("Token refresh failed:", error);
            setToaster("Session expired. Please log in again.", "error");
            clearAuth();
            navigate("/login")
        },
    });
};
