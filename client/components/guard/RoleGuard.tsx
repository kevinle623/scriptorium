"use client";

import { useEffect } from "react";
import { useAuth } from "@client/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useToaster } from "@client/providers/ToasterProvider";
import LoadingSpinnerScreen from "@client/components/loading/LoadingSpinnerScreen";
import { Role } from "@/types/dtos/roles"
import { useUser } from "@client/hooks/users/useUser";

interface AdminGuardProps {
    children: React.ReactNode;
    reroute?: string;
}

const AdminGuard = ({ children, reroute = "/" }: AdminGuardProps) => {
    const { isAuthed, isInitialized } = useAuth();
    const router = useRouter();
    const { data: user, isLoading } = useUser();
    const { setToaster } = useToaster();

    useEffect(() => {
        if (isLoading || !isInitialized) return
        if (!isAuthed) {
            setToaster("Not authorized to access this page. Redirecting...", "error");
            router.push(reroute || "/login");
        } else if (user && user.role !== Role.ADMIN) {
            setToaster("Admin access required. Redirecting...", "error");
            router.push(reroute || "/");
        } else if (!isLoading && !user) {
            setToaster("Unable to verify user. Redirecting...", "error");
            router.push(reroute || "/login");
        }
    }, [isInitialized, isAuthed, user, isLoading, reroute, router, setToaster]);

    if (isLoading || !isAuthed) {
        return <LoadingSpinnerScreen />;
    }

    return children;
};

export default AdminGuard;
