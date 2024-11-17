import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@client/api/services/userService";

export const useRegister = () => {
    return useMutation({
        mutationFn: registerUser,
    });
};