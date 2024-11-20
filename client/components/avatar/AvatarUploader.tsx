"use client";

import React, { useState } from "react";
import { useUploadAvatar } from "@client/hooks/useUploadAvatar";

interface AvatarUploaderProps {
    onAvatarUpload: (avatarUrl: string) => void;
    initialAvatar?: string;
}

const AvatarUploader = ({ onAvatarUpload, initialAvatar }: AvatarUploaderProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(initialAvatar || null);
    const [error, setError] = useState<string | null>(null);
    const { mutate: uploadAvatar, isPending: isLoading } = useUploadAvatar();

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
                setPreview(null);
            } else {
                setFile(selectedFile);
                setPreview(URL.createObjectURL(selectedFile));
            }
        }
    };

    const handleUpload = () => {
        if (!file) {
            setError("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append("avatar", file);

        uploadAvatar(formData, {
            onSuccess: (data) => {
                onAvatarUpload(data.avatar);
                setPreview(data.avatar);
            },
            onError: () => {
                setError("Failed to upload avatar. Please try again.");
            },
        });
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            {/* Avatar Preview */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500">
                {preview ? (
                    <img
                        src={preview}
                        alt="Avatar Preview"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
                        No Avatar
                    </div>
                )}
            </div>

            {/* File Input */}
            <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                className="text-sm text-gray-500"
            />

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Upload Button */}
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
