// hooks/useUser.ts

import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@client/api/services/userService";
import { useAuth } from "@client/providers/AuthProvider";
import {GetUserRequest, GetUserResponse} from "@types/dtos/user";
import {getUserIdFromAccessToken} from "@utils/jwtUtils";


export const useUser = () => {
    const { getAccessToken } = useAuth();
    const accessToken = getAccessToken();
    if (!accessToken) {
        throw new Error("No accessToken available.");
    }

    const userId = getUserIdFromAccessToken(accessToken)?.toString();

    if (!userId) {
        throw new Error("Unable to parse user ID from accessToken.");
    }

    return useQuery<GetUserResponse, Error, GetUserRequest>({
        queryKey: ["user"],
        queryFn: () => getUserById(userId),
    });
};