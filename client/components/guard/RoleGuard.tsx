"use client";

import { useEffect } from "react";
import { useAuth } from "@client/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useToaster } from "@client/providers/ToasterProvider";
import LoadingSpinner from "@client/components/loading/LoadingSpinner";
import { getRoleFromAccessToken } from "@utils/jwtUtils"

interface AdminGuardProps {
    children: React.ReactNode;
    reroute?: string;
}

const AdminGuard = ({ children, reroute = "/login" }: AdminGuardProps) => {
    const { isAuthed, getAccessToken } = useAuth();
    const router = useRouter();
    const { setToaster } = useToaster();

    useEffect(() => {
        if (!isAuthed) {
            setToaster("Not authorized to access this page. Redirecting...", "error");
            router.push(reroute || "/login");
        } else {
            const accessToken = getAccessToken();
            if (accessToken) {
                const role = getRoleFromAccessToken(accessToken);
                if (role !== "admin") {
                    setToaster("Admin access required. Redirecting...", "error");
                    router.push(reroute || "/login");
                }
            } else {
                setToaster("Unable to verify user role. Redirecting...", "error");
                router.push(reroute || "/login");
            }
        }
    }, [isAuthed, getAccessToken, reroute, router, setToaster]);

    if (!isAuthed) {
        return <LoadingSpinner />;
    }

    return children;
};

export default AdminGuard;
