"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
};

interface CodePlaygroundCacheContextValue {
    language: string;
    code: string;
    setLanguage: (language: string) => void;
    setCode: (code: string) => void;
    resetPlayground: () => void;
}

const CodePlaygroundCacheContext = createContext<CodePlaygroundCacheContextValue | undefined>(undefined);

export const useCodePlaygroundCache = () => {
    const context = useContext(CodePlaygroundCacheContext);
    if (!context) {
        throw new Error("useCodePlaygroundCache must be used within a CodePlaygroundCacheProvider");
    }
    return context;
};

interface CodePlaygroundCacheProviderProps {
    children: ReactNode;
}

export const CodePlaygroundCacheProvider = ({ children }: CodePlaygroundCacheProviderProps) => {
    const [language, setLanguageState] = useState<string>("javascript");
    const [code, setCodeState] = useState<string>("// Write your code here");

    const CACHE_KEY_LANGUAGE = "codePlayground_language";
    const CACHE_KEY_CODE = "codePlayground_code";

    const saveToLocalStorage = debounce((key: string, value: string) => {
        localStorage.setItem(key, value);
    }, 500);

    const setLanguage = (newLanguage: string) => {
        setLanguageState(newLanguage.toLowerCase());
        saveToLocalStorage(CACHE_KEY_LANGUAGE, newLanguage);
    };

    const setCode = (newCode: string) => {
        setCodeState(newCode);
        saveToLocalStorage(CACHE_KEY_CODE, newCode);
    };

    const resetPlayground = () => {
        setLanguage("javascript");
        setCode("// Write your code here");
        localStorage.removeItem(CACHE_KEY_LANGUAGE);
        localStorage.removeItem(CACHE_KEY_CODE);
    };

    useEffect(() => {
        const savedLanguage = localStorage.getItem(CACHE_KEY_LANGUAGE);
        const savedCode = localStorage.getItem(CACHE_KEY_CODE);

        if (savedLanguage) setLanguageState(savedLanguage);
        if (savedCode) setCodeState(savedCode);
    }, []);

    return (
        <CodePlaygroundCacheContext.Provider value={{ language, code, setLanguage, setCode, resetPlayground }}>
            {children}
        </CodePlaygroundCacheContext.Provider>
    );
};
