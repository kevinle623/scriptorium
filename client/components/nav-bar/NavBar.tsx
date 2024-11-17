"use client";

import { useState } from "react";
import Link from "next/link";
import { FaBlog, FaCode, FaGamepad, FaBars, FaTimes, FaPenNib } from "react-icons/fa";
import useMobileDetect from "@client/hooks/useMobileDetect";
import ThemeSwitcher from "@client/components/theme-switcher/ThemeSwitcher";

const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const isMobile = useMobileDetect();

    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
        <nav className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-md fixed top-0 w-full z-50">
            <div className="container mx-auto flex items-center justify-between py-6 px-6 lg:px-16">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-3 text-3xl font-extrabold hover:text-blue-500 dark:hover:text-blue-400"
                >
                    <FaPenNib style={{ color: "#A1A6B4" }} className="text-3xl" />
                    Scriptorium
                </Link>

                {/* Hamburger Menu Button for Mobile */}
                {isMobile && (
                    <button
                        className="text-gray-900 dark:text-gray-100 text-2xl md:hidden"
                        onClick={toggleMenu}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                    >
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                )}

                {/* Desktop Navigation Links & ThemeSwitcher */}
                {!isMobile && (
                    <div className="flex items-center gap-8">
                        <Link
                            href="/blogs"
                            className="flex items-center justify-center gap-3 px-6 py-3 rounded-lg text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-lg transition-all"
                        >
                            <FaBlog className="text-xl" />
                            <span>Blogs</span>
                        </Link>

                        <Link
                            href="/code-templates"
                            className="flex items-center justify-center gap-3 px-6 py-3 rounded-lg text-gray-900 bg-gray-200 hover:bg-gray-300 dark:text-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-lg transition-all"
                        >
                            <FaCode className="text-xl" />
                            <span>Code Templates</span>
                        </Link>

                        <Link
                            href="/playground"
                            className="flex items-center justify-center gap-3 px-6 py-3 rounded-lg text-gray-900 bg-gray-200 hover:bg-gray-300 dark:text-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-lg transition-all"
                        >
                            <FaGamepad className="text-xl" />
                            <span>Playground</span>
                        </Link>
                        <ThemeSwitcher />
                    </div>
                )}
            </div>

            {/* Mobile Modal Navigation */}
            {isMobile && menuOpen && (
                <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 bg-opacity-95 dark:bg-opacity-95 flex flex-col items-center justify-center gap-6">
                    <Link
                        href="/blogs"
                        className="flex items-center justify-center gap-3 px-6 py-3 rounded-lg text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-lg transition-all"
                        onClick={() => setMenuOpen(false)}
                    >
                        <FaBlog className="text-xl" />
                        <span>Blogs</span>
                    </Link>

                    <Link
                        href="/code-templates"
                        className="flex items-center justify-center gap-3 px-6 py-3 rounded-lg text-gray-900 bg-gray-200 hover:bg-gray-300 dark:text-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-lg transition-all"
                        onClick={() => setMenuOpen(false)}
                    >
                        <FaCode className="text-xl" />
                        <span>Code Templates</span>
                    </Link>

                    <Link
                        href="/playground"
                        className="flex items-center justify-center gap-3 px-6 py-3 rounded-lg text-gray-900 bg-gray-200 hover:bg-gray-300 dark:text-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-lg transition-all"
                        onClick={() => setMenuOpen(false)}
                    >
                        <FaGamepad className="text-xl" />
                        <span>Playground</span>
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default NavBar;
