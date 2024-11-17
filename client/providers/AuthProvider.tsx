"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextProps {
    isAuthed: boolean;
    getAccessToken: () => string | null;
    getRefreshToken: () => string | null;
    setAccessToken: (token: string) => void;
    setRefreshToken: (token: string) => void;
    clearAuth: () => void;
    isInitialized: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [accessToken, setAccessTokenState] = useState<string | null>(null);
    const [refreshToken, setRefreshTokenState] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const storedAccessToken = localStorage.getItem("accessToken");
        const storedRefreshToken = localStorage.getItem("refreshToken");

        setAccessTokenState(storedAccessToken);
        setRefreshTokenState(storedRefreshToken);
        setIsInitialized(true);
    }, []);

    const setAccessToken = (token: string) => {
        localStorage.setItem("accessToken", token);
        setAccessTokenState(token);
    };

    const setRefreshToken = (token: string) => {
        localStorage.setItem("refreshToken", token);
        setRefreshTokenState(token);
    };

    const clearAuth = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setAccessTokenState(null);
        setRefreshTokenState(null);
    };

    const getAccessToken = () => accessToken;
    const getRefreshToken = () => refreshToken;

    const isAuthed = Boolean(accessToken && refreshToken);

    return (
        <AuthContext.Provider
            value={{
                isAuthed,
                getAccessToken,
                getRefreshToken,
                setAccessToken,
                setRefreshToken,
                clearAuth,
                isInitialized,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
