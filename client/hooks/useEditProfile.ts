import { useMutation } from '@tanstack/react-query';
import { EditUserRequest, EditUserResponse } from '@/types/dtos/user';
import {editUser} from "@client/api/services/userService";

export const useEditProfile = () => {
    return useMutation<EditUserResponse, Error, EditUserRequest>({
        mutationFn: editUser
    })
};