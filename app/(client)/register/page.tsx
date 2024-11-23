"use client";

import { useRouter } from "next/navigation";
import RegisterComponent from "@client/components/onboarding/Register"

const Register = () => {
    const router = useRouter();
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
            <div className="rounded-lg p-6 max-w-lg">
                <div className="space-y-6">
                    <RegisterComponent
                        onSuccess={() => router.push("/")}
                        toggleLogin={() => router.push("/login")}
                    />
                </div>
            </div>
        </div>
    );
};

export default Register;
