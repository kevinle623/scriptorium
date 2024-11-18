"use client";

import React, { createContext, useContext, useCallback } from "react";
import { Toaster, toast } from "react-hot-toast";

const ToasterContext = createContext({
    setToaster: (message: string, type: "success" | "error" | "info" = "info") => {},
});

export const useToaster = () => useContext(ToasterContext);

export const useGlobalToaster = () => {
    const { setToaster } = useToaster();
    return setToaster;
};

export const ToasterProvider = ({ children }: { children: React.ReactNode }) => {
    const setToaster = useCallback(
        (message: string, type: "success" | "error" | "info" = "info") => {
            switch (type) {
                case "success":
                    toast.success(message);
                    break;
                case "error":
                    toast.error(message);
                    break;
                default:
                    toast(message);
            }
        },
        []
    );

    return (
        <ToasterContext.Provider value={{ setToaster }}>
            {children}
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: "#333",
                        color: "#fff",
                    },
                }}
            />
        </ToasterContext.Provider>
    );
};
