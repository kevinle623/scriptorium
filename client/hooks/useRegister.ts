import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@client/services/userService";

export const useRegister = () => {
    return useMutation({
        mutationFn: registerUser,
    });
};