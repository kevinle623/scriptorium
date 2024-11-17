"use client";

import LoginComponent from "@client/components/onboarding/Login"
import {useRouter} from "next/navigation";
const Login = () => {
    const router = useRouter()
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
             <LoginComponent
                 onSuccess={() => router.push("/")}
                 toggleRegister={() => router.push("/register")}
             />
        </div>
    );
};

export default Login;
