"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToaster } from "@client/providers/ToasterProvider";
import LoadingSpinnerScreen from "@client/components/loading/LoadingSpinnerScreen";
import {useUser} from "@client/hooks/useUser";
import {useEditProfile} from "@client/hooks/useEditProfile";

const EditProfilePage = () => {
    const { data: user, isLoading: isUserLoading } = useUser();
    const { mutate: editProfile, isLoading: isEditing } = useEditProfile();
    const { setToaster } = useToaster();
    const router = useRouter();

    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [avatar, setAvatar] = useState<string>("");

    useEffect(() => {
        if (user) {
            setEmail(user.email || "");
            setPhone(user.phone || "");
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
            setAvatar(user.avatar || "");
        }
    }, [user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        editProfile(
            { userId: user?.id, email, phone, firstName, lastName, avatar },
            {
                onSuccess: () => {
                    setToaster("Profile updated successfully!", "success");
                    router.push("/profile");
                },
                onError: (error) => {
                    setToaster(error.message || "Failed to update profile.", "error");
                },
            }
        );
    };

    if (isUserLoading) {
        return <LoadingSpinnerScreen />;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Edit Profile</h1>
                <button
                    onClick={() => router.push("/profile")}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                    Back to Profile
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300"
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Phone
                    </label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300"
                    />
                </div>

                {/* First Name */}
                <div>
                    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        First Name
                    </label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300"
                    />
                </div>

                {/* Last Name */}
                <div>
                    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Last Name
                    </label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300"
                    />
                </div>

                {/* Avatar */}
                <div>
                    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Avatar URL
                    </label>
                    <input
                        type="url"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isEditing}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isEditing ? "Updating..." : "Update Profile"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfilePage;
