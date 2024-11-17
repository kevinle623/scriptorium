// hooks/useUser.ts

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@client/providers/AuthProvider";
import { getUser } from "@client/api/services/userService";
import {GetUserResponse} from "@types/dtos/user";

export const useUser = () => {
    const { isAuthed } = useAuth()

    return useQuery<GetUserResponse, Error>({
        queryKey: ["user"],
        queryFn: getUser,
        enabled: isAuthed
    });
};
