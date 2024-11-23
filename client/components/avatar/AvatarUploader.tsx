"use client";

import React, {useEffect, useState} from "react";
import { useUploadAvatar } from "@client/hooks/users/useUploadAvatar";
import Image from "next/image"
import {useToaster} from "@client/providers/ToasterProvider";
import {FaUserCircle} from "react-icons/fa";

interface AvatarUploaderProps {
    onAvatarUpload: (avatarUrl: string) => void;
    initialAvatar?: string;
}

const AvatarUploader = ({ onAvatarUpload, initialAvatar }: AvatarUploaderProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(initialAvatar || null);
    const [error, setError] = useState<string | null>(null);
    const { mutate: uploadAvatar, isPending: isLoading } = useUploadAvatar();
    const { setToaster } = useToaster()

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
                const updatedAvatarUrl = `${data.avatar}?timestamp=${new Date().getTime()}`;
                onAvatarUpload(updatedAvatarUrl);
                setPreview(updatedAvatarUrl);
                setToaster("Avatar updated successfully!", "success");
            },
            onError: () => {
                setError("Failed to upload avatar. Please try again.");
            },
        });
    };

    useEffect(() => {
        if (initialAvatar && !preview) {
            setPreview(initialAvatar)
        }
    }, [initialAvatar]);

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="relative rounded-full overflow-hidden border-4 border-blue-500">
                {preview ? (
                    <Image
                        src={preview}
                        alt="Avatar Preview"
                        height={100}
                        width={100}
                        className="object-cover rounded-full"
                    />
                ) : (
                    <FaUserCircle className="text-gray-400 dark:text-gray-600 w-24 h-24" />
                )}
            </div>

            <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                className="text-sm text-gray-500"
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
