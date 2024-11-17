"use client";

import { useEffect } from "react";
import { useAuth } from "@client/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useToaster } from "@client/providers/ToasterProvider";
import LoadingSpinner from "@client/components/loading/LoadingSpinner";

interface AuthGuardProps {
    children: React.ReactNode;
    reroute?: string;
}

const AuthGuard = ({ children, reroute = "/login" }: AuthGuardProps) => {
    const { isAuthed } = useAuth();
    const router = useRouter();
    const { setToaster } = useToaster();

    useEffect(() => {
        if (!isAuthed) {
            setToaster("Not authorized to access this page. Redirecting...", "error");
            router.push(reroute || "/login");
        }
    }, [isAuthed, reroute, router, setToaster]);

    if (!isAuthed) {
        return <LoadingSpinner/>;
    }

    return children
};

export default AuthGuard;
