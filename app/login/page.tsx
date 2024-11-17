"use client";

import { useForm } from "react-hook-form";
import { useLogin } from "@client/hooks/useLogin";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToaster } from "@client/providers/ToasterProvider";
import {LoginRequest, LoginResponse} from "@types/dtos/user";
import {useAuth} from "@client/providers/AuthProvider";
const Login = () => {
    const router = useRouter();
    const { setAccessToken, setRefreshToken } = useAuth()
    const { setToaster } = useToaster()
    const [errorMessage, setErrorMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginRequest>();

    const loginMutation = useLogin();

    const onSubmit = (formData: LoginRequest) => {
        loginMutation.mutate(formData, {
            onSuccess: (data: LoginResponse) => {
                setToaster("Logged in successfully", "success");
                setAccessToken(data.accessToken);
                setRefreshToken(data.refreshToken);
                router.push("/");
            },
            onError: (error: any) => {
                setToaster(error.message || "Failed to log in", "error");
                setErrorMessage(error.message || "Failed to log in")
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
                    Login
                </h2>

                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
                        <strong className="font-bold">Error: </strong>
                        <span>{errorMessage}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 dark:text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            {...register("email", { required: "Email is required" })}
                            className={`w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                errors.email ? "border-red-500" : "border-gray-300"
                            } dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100`}
                            placeholder="Enter your email"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            {...register("password", { required: "Password is required" })}
                            className={`w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                errors.password ? "border-red-500" : "border-gray-300"
                            } dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100`}
                            placeholder="Enter your password"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loginMutation.isPending ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                    Don&#39;t have an account?{" "}
                    <a
                        href="/register"
                        className="text-blue-500 hover:text-blue-600 font-medium"
                    >
                        Register here
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
