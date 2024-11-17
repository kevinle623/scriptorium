"use client";

import {useState} from "react";
import Link from "next/link";
import {FaPenNib, FaBars, FaTimes} from "react-icons/fa";
import useMobileDetect from "@client/hooks/useMobileDetect";
import ThemeSwitcher from "@client/components/theme-switcher/ThemeSwitcher";
import {useAuth} from "@client/providers/AuthProvider";
import LogoutButton from "@client/components/button/LogoutButton";

const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const isMobile = useMobileDetect();
    const {isAuthed} = useAuth();

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const navLinks = [
        {href: "/blogs", label: "Blogs"},
        {href: "/code-templates", label: "Templates"},
        {href: "/playground", label: "Playground"},
    ];

    return (
        <nav className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-md fixed top-0 w-full z-50">
            <div className="container mx-auto flex items-center justify-between py-6 px-6 lg:px-16">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-3 text-3xl font-extrabold hover:text-blue-500 dark:hover:text-blue-400"
                >
                    <FaPenNib style={{color: "#A1A6B4"}} className="text-3xl"/>
                    Scriptorium
                </Link>

                {/* Hamburger Menu Button for Mobile */}
                {isMobile && (
                    <button
                        className="text-gray-900 dark:text-gray-100 text-2xl md:hidden"
                        onClick={toggleMenu}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                    >
                        {menuOpen ? <FaTimes/> : <FaBars/>}
                    </button>
                )}

                {/* Desktop Navigation Links & ThemeSwitcher */}
                {!isMobile && (
                    <div className="flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-gray-700 dark:text-gray-300 text-lg hover:!text-blue-500 dark:hover:!text-blue-400 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}

                        {isAuthed ? (
                            <>
                                <Link
                                    href="/profile"
                                    className="text-gray-700 dark:text-gray-300 text-lg hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                                >
                                    Profile
                                </Link>
                                <LogoutButton renderIcon={false} variant="text"/>
                            </>

                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-gray-700 dark:text-gray-300 text-lg hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="text-gray-700 dark:text-gray-300 text-lg hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                                >
                                    Register
                                </Link>
                            </>

                        )}

                        <ThemeSwitcher/>
                    </div>
                )}
            </div>

            {/* Mobile Modal Navigation */}
            {isMobile && menuOpen && (
                <div
                    className="fixed inset-0 z-50 bg-white dark:bg-gray-900 bg-opacity-95 dark:bg-opacity-95 flex flex-col items-center justify-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-gray-700 dark:text-gray-300 text-lg hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {isAuthed ? (
                        <>
                            <Link
                                href="/profile"
                                className="text-gray-700 dark:text-gray-300 text-lg hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                                onClick={() => setMenuOpen(false)}
                            >
                                Profile
                            </Link>
                            <LogoutButton renderIcon={false} variant="text"/>
                        </>

                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-gray-700 dark:text-gray-300 text-lg hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                                onClick={() => setMenuOpen(false)}
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="text-gray-700 dark:text-gray-300 text-lg hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                                onClick={() => setMenuOpen(false)}
                            >
                                Register
                            </Link>
                        </>

                    )}

                    <ThemeSwitcher/>
                </div>
            )}
        </nav>
    );
};

export default NavBar;
