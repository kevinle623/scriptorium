import { useMutation } from "@tanstack/react-query";
import { LoginRequest, LoginResponse } from "@types/dtos/user";
import {loginUser} from "@client/api/services/userService"

export const useLogin = () => {
    return useMutation<LoginResponse, Error, LoginRequest>({
        mutationFn: loginUser,
    });
};