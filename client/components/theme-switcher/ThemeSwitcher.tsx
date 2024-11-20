"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon, faDesktop } from "@fortawesome/free-solid-svg-icons";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

type Theme = "light" | "dark" | "system";
const ThemeSwitcher = () => {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const themes = ["light", "dark", "system"];
    const icons = {
        light: faSun,
        dark: faMoon,
        system: faDesktop,
    };

    const toggleTheme = () => {
        const currentIndex = themes.indexOf(resolvedTheme || "system");
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        setTheme(nextTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            className="flex items-center justify-center gap-3 px-6 py-3 rounded-lg text-gray-900 bg-gray-200 hover:bg-gray-300 dark:text-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-lg transition-all"
            aria-label={`Toggle Theme (${resolvedTheme})`}
        >
            <FontAwesomeIcon icon={icons[resolvedTheme as Theme || "system"] as IconProp} className="text-xl" />
        </button>
    );
};

export default ThemeSwitcher;
