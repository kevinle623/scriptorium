"use client";

import React from "react";
import { useUser } from "@client/hooks/useUser";
import LoadingSpinner from "@client/components/loading/LoadingSpinner";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa"; // Importing a default icon

const ProfilePage = () => {
    const { data: user, isLoading, isError, error } = useUser();
    const router = useRouter();

    if (isLoading) {
        return <LoadingSpinner />;
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Profile</h1>
                <button
                    onClick={() => router.push("/profile/edit")}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Edit Profile
                </button>
            </div>

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
                        <div className="flex items-center justify-center rounded-full w-24 h-24 bg-gray-200 dark:bg-gray-700 mt-4">
                            <FaUserCircle className="text-gray-500 dark:text-gray-400 w-20 h-20" />
                        </div>
                    )}
                </p>
            </div>
        </div>
    );
};

export default ProfilePage;
