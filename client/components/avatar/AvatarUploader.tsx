"use client";

import React, { useState } from "react";
import { useUploadAvatar } from "@client/hooks/useUploadAvatar";

interface AvatarUploaderProps {
    onAvatarUpload: (avatarUrl: string) => void;
}

const AvatarUploader = ({ onAvatarUpload }: AvatarUploaderProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { mutate: uploadAvatar, isLoading } = useUploadAvatar();

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const VALID_FILE_TYPES = ["image/jpeg", "image/png"];

    const validateFile = (file: File) => {
        if (!VALID_FILE_TYPES.includes(file.type)) {
            return "Only JPG and PNG file types are allowed.";
        }

        if (file.size > MAX_FILE_SIZE) {
            return "File size must not exceed 5MB.";
        }

        return null;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);

        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            const validationError = validateFile(selectedFile);

            if (validationError) {
                setError(validationError);
                setFile(null);
            } else {
                setFile(selectedFile);
            }
        }
    };

    const handleUpload = () => {
        if (!file) {
            alert("Please select a file first!");
            return;
        }

        setError(null);

        const formData = new FormData();
        formData.append("avatar", file);

        uploadAvatar(formData, {
            onSuccess: (data) => {
                onAvatarUpload(data.avatar);
                alert("Avatar uploaded successfully!");
            },
            onError: (error) => {
                console.error("Avatar upload failed:", error);
                setError("Failed to upload avatar. Please try again.");
            },
        });
    };

    return (
        <div className="flex flex-col space-y-2">
            <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
                type="button"
                onClick={handleUpload}
                disabled={isLoading || !file}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
                {isLoading ? "Uploading..." : "Upload Avatar"}
            </button>
        </div>
    );
};

export default AvatarUploader;
