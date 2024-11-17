"use client";

import React from "react";
import { useLogout } from "@client/hooks/useLogout";
import { FaSignOutAlt } from "react-icons/fa";

interface LogoutButtonProps {
    renderIcon?: boolean;
    variant?: "default" | "text";
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
                                                       renderIcon = true,
                                                       variant = "default",
                                                   }) => {
    const { mutate: logout, isPending } = useLogout();

    const handleLogout = () => {
        logout();
    };

    const baseStyles =
        variant === "default"
            ? "flex items-center gap-3 px-5 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
            : "text-gray-700 dark:text-gray-300 text-lg hover:text-blue-500 dark:hover:text-blue-400 transition-colors";

    return (
        <button
            onClick={handleLogout}
            disabled={isPending}
            className={baseStyles}
        >
            {renderIcon && <FaSignOutAlt className="text-lg" />}
            {isPending ? "Logging out..." : "Logout"}
        </button>
    );
};

export default LogoutButton;
