"use client";

import React from "react";
import { useUserById } from "@client/hooks/users/useUserById";
import { FaUserCircle } from "react-icons/fa";
;
import LoadingSpinner from "@client/components/loading/LoadingSpinner";
import AvatarImage from "@client/components/avatar/AvatarImage";

interface UserProfileSectionProps {
    userId: string;
    sectionName: string;
}

const UserProfileSection = ({ userId, sectionName }: UserProfileSectionProps) => {
    const { data: user, isLoading, isError } = useUserById(userId);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isError || !user) {
        return <p className="text-red-500">Failed to load user profile.</p>;
    }

    return (
        <div className="p-6 rounded-lg shadow-md bg-white dark:bg-gray-800">
            <h2 className="text-xl font-bold mb-4">{sectionName}</h2>
            <div className="flex items-center space-x-4 mb-4">
                <AvatarImage
                    src={user?.avatar}
                    alt="User Avatar"
                    width={45}
                    height={45}
                    className="object-cover rounded-full"
                />
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {user.firstName} {user.lastName}
                    </h2>
                </div>
            </div>
            <div className="text-gray-700 dark:text-gray-300 space-y-2">
                <p>
                    <strong>Email:</strong> {user.email}
                </p>
                <p>
                    <strong>Phone:</strong> {user.phone || "Not provided"}
                </p>
            </div>
        </div>
    );
};

export default UserProfileSection;
