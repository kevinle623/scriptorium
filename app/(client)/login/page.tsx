"use client";

import LoginComponent from "@client/components/onboarding/Login"
import {useRouter} from "next/navigation";
import React from "react";

const Login = () => {
    const router = useRouter()
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
            <div className="rounded-lg p-6 max-w-lg">
                <div className="space-y-6">
                    <LoginComponent
                        onSuccess={() => router.push("/")}
                        toggleRegister={() => router.push("/register")}
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;
