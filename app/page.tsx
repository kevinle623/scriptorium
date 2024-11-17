"use client";

import Link from "next/link";
import { FaBlog, FaCode, FaGamepad, FaPenNib, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { useAuth } from "@client/providers/AuthProvider";

export default function Home() {
  const { isAuthed } = useAuth();

  return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-sans">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start text-center sm:text-left">
          {/* Logo Section */}
          <div className="flex items-center justify-center gap-4">
            <FaPenNib style={{ color: "#A1A6B4" }} className="text-6xl" />
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-5xl">
              Welcome to Scriptorium
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Explore insightful blogs, handy code templates, and interactive coding playgrounds.
          </p>

          {/* Navigation Buttons */}
          <div className="flex gap-4 items-center flex-wrap justify-center sm:justify-start">
            <Link
                href="/blogs"
                className="flex items-center justify-center gap-3 px-5 py-3 rounded-lg text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-lg transition-all"
            >
              <FaBlog className="text-xl" />
              <span className="font-medium">Blogs</span>
            </Link>

            <Link
                href="/code-templates"
                className="flex items-center justify-center gap-3 px-5 py-3 rounded-lg text-gray-900 bg-gray-200 hover:bg-gray-300 dark:text-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-lg transition-all"
            >
              <FaCode className="text-xl" />
              <span className="font-medium">Code Templates</span>
            </Link>

            <Link
                href="/playground"
                className="flex items-center justify-center gap-3 px-5 py-3 rounded-lg text-gray-900 bg-gray-200 hover:bg-gray-300 dark:text-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-lg transition-all"
            >
              <FaGamepad className="text-xl" />
              <span className="font-medium">Playground</span>
            </Link>
          </div>

          {/* Authentication Buttons */}
          {!isAuthed && (
              <div className="flex gap-4 items-center flex-wrap justify-center sm:justify-start mt-6">
                <Link
                    href="/login"
                    className="flex items-center justify-center gap-3 px-5 py-3 rounded-lg text-white bg-green-500 hover:bg-green-600 shadow-lg transition-all"
                >
                  <FaSignInAlt className="text-xl" />
                  <span className="font-medium">Login</span>
                </Link>
                <Link
                    href="/register"
                    className="flex items-center justify-center gap-3 px-5 py-3 rounded-lg text-white bg-purple-500 hover:bg-purple-600 shadow-lg transition-all"
                >
                  <FaUserPlus className="text-xl" />
                  <span className="font-medium">Register</span>
                </Link>
              </div>
          )}
        </main>
      </div>
  );
}
