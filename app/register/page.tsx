"use client";

import { useRouter } from "next/navigation";
import RegisterComponent from "@client/components/onboarding/Register"

const Register = () => {
    const router = useRouter();
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <RegisterComponent
                onSuccess={() => router.push("/")}
                toggleLogin={() => router.push("/login")}
            />
        </div>
    );
};

export default Register;
