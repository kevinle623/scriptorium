"use client";

import { useState } from "react";
import { useMostReportedComments } from "@client/hooks/useMostReportedComments";
import { GetCommentsRequest } from "@/types/dtos/comments";
import Link from "next/link";

const AdminCommentsPage = () => {
    const [filters, setFilters] = useState<GetCommentsRequest>({
        page: 1,
        limit: 10,
        hidden: undefined,
    });

    const { data, isLoading, isError } = useMostReportedComments(filters);

    const handleFilterChange = (key: keyof GetCommentsRequest, value: unknown | undefined) => {
        if (!value) return
        setFilters((prev) => ({
            ...prev,
            [key]: value,
            page: 1,
        }));
    };

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Admin - Most Reported Comments</h1>

                <div className="flex items-center space-x-4 mb-6">
                    <Link
                        href="/"
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                        Home
                    </Link>
                    <Link
                        href="/admin/blogs"
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                        Reported Blog Posts
                    </Link>
                    <Link
                        href="/admin"
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                        Admin Portal
                    </Link>
                </div>

                <div className="flex items-center space-x-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Hidden</label>
                        <select
                            value={String(filters.hidden)}
                            onChange={(e) =>
                                handleFilterChange(
                                    "hidden",
                                    e.target.value === "any" ? undefined : e.target.value === "true"
                                )
                            }
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
                        >
                            <option value="any">Any</option>
                            <option value="true">Hidden</option>
                            <option value="false">Not Hidden</option>
                        </select>
                    </div>
                </div>

                {isLoading ? (
                    <p>Loading...</p>
                ) : isError ? (
                    <p>Error loading data.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
                            <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                                    Content
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                                    Reports
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                                    Hidden
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {data?.comments.map((comment) => (
                                <tr
                                    key={comment.id}
                                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    <td className="px-4 py-2">{comment.content}</td>
                                    <td className="px-4 py-2">{comment.reportCount || 0}</td>
                                    <td className="px-4 py-2">
                                        {comment.hidden ? "Yes" : "No"}
                                    </td>
                                    <td className="px-4 py-2">
                                        <Link
                                            href={`/admin/comments/${comment.id}`}
                                            className="text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="flex justify-end space-x-4 mt-4">
                    <button
                        onClick={() => handlePageChange(filters.page! - 1)}
                        disabled={filters.page === 1}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => handlePageChange(filters.page! + 1)}
                        disabled={data && filters.page! >= Math.ceil(data.totalCount / filters.limit!)}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminCommentsPage;
