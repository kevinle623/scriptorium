import {useMutation} from "@tanstack/react-query";
import {uploadAvatar} from "@client/api/services/userService";

export const useUploadAvatar = () => {
    return useMutation({
        mutationFn: uploadAvatar
    });
};