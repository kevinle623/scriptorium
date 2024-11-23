"use client";

import React from "react";
import { useUser } from "@client/hooks/users/useUser";
import LoadingSpinnerScreen from "@client/components/loading/LoadingSpinnerScreen";
import { useRouter } from "next/navigation";

import AvatarImage from "@client/components/avatar/AvatarImage";

const ProfilePage = () => {
    const { data: user, isLoading, isError, error } = useUser();
    const router = useRouter();

    if (isLoading) {
        return <LoadingSpinnerScreen />;
    }

    if (isError || !user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center">
                <h1 className="text-2xl font-bold text-red-500">Error</h1>
                <p className="text-gray-700 dark:text-gray-300">
                    {error?.message || "An error occurred while fetching your profile."}
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            {/* Header */}
            <div className="flex justify-center items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Your Profile</h1>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 flex flex-col items-center">
                <div className="relative mb-6">
                    <AvatarImage
                        src={user?.avatar}
                        alt="User Avatar"
                        width={100}
                        height={100}
                        className="object-cover rounded-full"
                    />
                </div>

                {/* Name */}
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {user?.firstName} {user?.lastName}
                </h2>

                {/* Email */}
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    <strong>Email:</strong> {user?.email}
                </p>

                {/* Phone */}
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    <strong>Phone:</strong> {user?.phone || "Not provided"}
                </p>

                {/* Edit Profile Button */}
                <button
                    onClick={() => router.push("/profile/edit")}
                    className="mt-4 px-6 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-600 transition"
                >
                    Edit Profile
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;
