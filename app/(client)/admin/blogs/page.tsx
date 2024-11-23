"use client";

import { useState } from "react";
import { useMostReportedBlogPosts } from "@client/hooks/blogs/useMostReportedBlogPosts";
import { BlogPostFilters } from "@/types/dtos/blogPosts";
import Link from "next/link";
import LoadingSpinner from "@client/components/loading/LoadingSpinner";

const AdminBlogsPage = () => {
    const [filters, setFilters] = useState<BlogPostFilters>({
        page: 1,
        limit: 10,
        hidden: undefined,
    });

    const { data, isLoading, isError } = useMostReportedBlogPosts(filters);

    const handleFilterChange = (key: keyof BlogPostFilters, value: boolean | undefined) => {
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
                <h1 className="text-2xl font-bold mb-6">Admin - Most Reported Blogs</h1>

                {/* Navigation Section */}
                <div className="flex items-center space-x-4 mb-6">
                    <Link
                        href="/"
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                        Home
                    </Link>
                    <Link
                        href="/admin/comments"
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                        Reported Comments
                    </Link>
                    <Link
                        href="/admin"
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                        Admin Portal
                    </Link>
                </div>

                {/* Filter Section */}
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

                {/* Table Section */}
                {isLoading ? (
                    <LoadingSpinner/>
                ) : isError ? (
                    <p>Error loading data.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
                            <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                                    Title
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
                            {data?.blogPosts.map((blog) => (
                                <tr
                                    key={blog.id}
                                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    <td className="px-4 py-2">{blog.title}</td>
                                    <td className="px-4 py-2">{blog.reportCount}</td>
                                    <td className="px-4 py-2">
                                        {blog.hidden ? "Yes" : "No"}
                                    </td>
                                    <td className="px-4 py-2">
                                        <Link
                                            href={`/admin/blogs/${blog.id}`}
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

                {/* Pagination */}
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

export default AdminBlogsPage;
