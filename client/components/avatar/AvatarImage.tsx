import React from "react";
import Image from "next/image";
import clsx from "clsx";
import { FaUserCircle } from "react-icons/fa";

interface AvatarImageProps {
    src?: string;
    width: number;
    height: number;
    alt: string;
    className?: string;
    useCache?: boolean;
}

const AvatarImage = ({ src, width, height, alt, className, useCache = false }: AvatarImageProps) => {
    if (!src) {
        return (
            <div
                className={clsx(
                    "flex items-center justify-center bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500",
                    "rounded-full",
                    className
                )}
                style={{ width, height }}
            >
                <FaUserCircle size={Math.min(width, height)} />
            </div>
        );
    }

    const avatarUrl = useCache ? src : `${src}?timestamp=${new Date().getTime()}`;

    return (
        <Image
            src={avatarUrl}
            alt={alt}
            width={width}
            height={height}
            className={clsx("object-cover rounded-full", className)}
        />
    );
};

export default AvatarImage;
