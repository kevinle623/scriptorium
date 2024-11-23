import React from "react";
import { useUserById } from "@client/hooks/users/useUserById";
import { FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import { Report } from "@/types/dtos/reports"

interface ReportItemProps {
    report: Report
}

const ReportItem = ({ report }: ReportItemProps) => {
    const { data: user, isLoading: userLoading, isError: userError } = useUserById(report.userId.toString());

    return (
        <div className="mb-4 p-4 rounded-lg shadow bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100">
            <div className="flex justify-between">
                <div className="flex items-center space-x-4">
                    {userLoading ? (
                        <div className="w-40 h-40 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
                    ) : userError || !user?.avatar ? (
                        <div className="flex items-center justify-center w-40 h-40 rounded-full bg-gray-200 dark:bg-gray-600">
                            <FaUserCircle className="text-gray-500 dark:text-gray-400 w-40 h-40" />
                        </div>
                    ) : (
                        <div className="rounded-full overflow-hidden">
                            <Image
                                src={user.avatar}
                                alt={`${user.firstName}'s avatar`}
                                width={40}
                                height={40}
                                className="object-cover rounded-full"
                            />
                        </div>
                    )}
                    <div>
                        <strong className="text-lg">
                            {userLoading
                                ? "Loading..."
                                : userError || !user
                                    ? `User ${report.userId}`
                                    : `${user.firstName} ${user.lastName}`}
                        </strong>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {new Date(report.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
            <p className="mt-4">{report.reason}</p>
        </div>
    );
};

export default ReportItem;
