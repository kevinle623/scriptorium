"use client";

import Link from "next/link";
import { FaBlog, FaComments, FaUserShield } from "react-icons/fa";
import { useAuth } from "@client/providers/AuthProvider";
import LogoutButton from "@client/components/button/LogoutButton";

export default function AdminHome() {
    const { isAuthed } = useAuth();

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-sans">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start text-center sm:text-left">
                <div className="flex items-center justify-center gap-4">
                    <FaUserShield style={{ color: "#A1A6B4" }} className="text-6xl" />
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-5xl">
                        Admin Portal
                    </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Manage reported blog posts and comments efficiently.
                </p>

                <div className="flex gap-4 items-center flex-wrap justify-center sm:justify-start">
                    <Link
                        href="/admin/blogs"
                        className="flex items-center justify-center gap-3 px-5 py-3 rounded-lg text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-lg transition-all"
                    >
                        <FaBlog className="text-xl" />
                        <span className="font-medium">Reported Blogs</span>
                    </Link>

                    <Link
                        href="/admin/comments"
                        className="flex items-center justify-center gap-3 px-5 py-3 rounded-lg text-gray-900 bg-gray-200 hover:bg-gray-300 dark:text-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-lg transition-all"
                    >
                        <FaComments className="text-xl" />
                        <span className="font-medium">Reported Comments</span>
                    </Link>
                </div>

                <div className="flex gap-4 items-center flex-wrap justify-center sm:justify-start mt-6">
                    {isAuthed && (
                        <div className="flex gap-4 items-center">
                            <LogoutButton />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
