"use client";

import { useEffect } from "react";
import { useAuth } from "@client/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useToaster } from "@client/providers/ToasterProvider";
import LoadingSpinnerScreen from "@client/components/loading/LoadingSpinnerScreen";

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
        return <LoadingSpinnerScreen/>;
    }

    return children
};

export default UnAuthGuard;
