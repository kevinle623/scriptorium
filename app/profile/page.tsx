"use client";

import React from "react";
import { useUser } from "@client/hooks/useUser";
import LoadingSpinner from "@client/components/loading/LoadingSpinner";

const ProfilePage = () => {
    const { data: user, isLoading, isError, error } = useUser();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
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
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Profile</h1>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold text-blue-500 mb-4">
                    {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                    <strong>Email:</strong> {user?.email}
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 mt-2">
                    <strong>Phone:</strong> {user?.phone || "Not provided"}
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 mt-2">
                    <strong>Avatar:</strong>{" "}
                    {user?.avatar ? (
                        <img
                            src={user?.avatar}
                            alt={`${user?.firstName}'s avatar`}
                            className="rounded-full w-24 h-24 mt-4"
                        />
                    ) : (
                        "No avatar provided"
                    )}
                </p>
            </div>
        </div>
    );
};

export default ProfilePage;
