import { useQuery } from "@tanstack/react-query";
import {GetUserResponse} from "@/types/dtos/user";
import {getUserById} from "@client/api/services/userService";

export const useUserById = (userId: string) => {

    return useQuery<GetUserResponse, Error>({
        queryKey: ["user", userId],
        queryFn: () => getUserById(userId),
    });
};
