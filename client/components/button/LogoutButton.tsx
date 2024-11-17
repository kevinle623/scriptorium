"use client";

import React from "react";
import { useLogout } from "@client/hooks/useLogout";
import { FaSignOutAlt } from "react-icons/fa";

const LogoutButton = () => {
    const { mutate: logout, isPending } = useLogout();

    const handleLogout = () => {
        logout();
    };

    return (
        <button
            onClick={handleLogout}
            disabled={isPending}
            className="flex items-center gap-3 px-5 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
        >
            <FaSignOutAlt className="text-lg" />
            {isPending ? "Logging out..." : "Logout"}
        </button>
    );
};

export default LogoutButton;
