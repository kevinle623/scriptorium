"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

const ThemeSwitcher = () => {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="flex items-center space-x-4">
            {/* Current Theme */}
            <span className="text-gray-900 dark:text-gray-100">
        Theme: {resolvedTheme}
      </span>

            {/* Toggle Buttons */}
            <button
                className={`px-3 py-1 rounded ${
                    theme === "light"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                }`}
                onClick={() => setTheme("light")}
            >
                Light
            </button>
            <button
                className={`px-3 py-1 rounded ${
                    theme === "dark"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                }`}
                onClick={() => setTheme("dark")}
            >
                Dark
            </button>
            <button
                className={`px-3 py-1 rounded ${
                    theme === "system"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                }`}
                onClick={() => setTheme("system")}
            >
                System
            </button>
        </div>
    );
};

export default ThemeSwitcher;
