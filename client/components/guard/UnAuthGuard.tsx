"use client";

import { useEffect } from "react";
import { useAuth } from "@client/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useToaster } from "@client/providers/ToasterProvider";
import LoadingSpinner from "@client/components/loading/LoadingSpinner";

interface UnAuthGuardProps {
    children: React.ReactNode;
    reroute?: string;
}

const UnAuthGuard = ({ children, reroute = "/" }: UnAuthGuardProps) => {
    const { isAuthed, isInitialized } = useAuth();
    const router = useRouter();
    const { setToaster } = useToaster();

    useEffect(() => {
        if (isInitialized && isAuthed) {
            router.push(reroute || "/");
        }
    }, [isAuthed, reroute, router, setToaster]);

    if (isAuthed || !isInitialized) {
        return <LoadingSpinner/>;
    }

    return children
};

export default UnAuthGuard;
