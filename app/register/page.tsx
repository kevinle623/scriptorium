"use client";

import { useForm } from "react-hook-form";
import { useRegister } from "@client/hooks/useRegister";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreateUserRequest } from "@types/dtos/user";
import { Role } from "@types/dtos/roles";
import { useToaster } from "@client/providers/ToasterProvider";

const Register = () => {
    const router = useRouter();
    const { setToaster } = useToaster();
    const [errorMessage, setErrorMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Omit<CreateUserRequest, "role">>();

    const registerMutation = useRegister();

    const onSubmit = (formData: Omit<CreateUserRequest, "role">) => {
        setErrorMessage("");

        const createUserRequest: CreateUserRequest = {
            ...formData,
            role: "user" as Role,
        };

        registerMutation.mutate(createUserRequest, {
            onSuccess: () => {
                setToaster("User registered successfully!", "success");
                router.push("/login");
            },
            onError: (error: any) => {
                const message = error.message || "An unexpected error occurred.";
                setErrorMessage(message);
                setToaster(message, "error");
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 max-w-lg w-full">
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
                    Register
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
                        <label htmlFor="phone" className="block text-gray-700 dark:text-gray-300">
                            Phone
                        </label>
                        <input
                            type="text"
                            id="phone"
                            {...register("phone", { required: "Phone is required" })}
                            className={`w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                errors.phone ? "border-red-500" : "border-gray-300"
                            } dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100`}
                            placeholder="Enter your phone number"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="firstName" className="block text-gray-700 dark:text-gray-300">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            {...register("firstName", { required: "First name is required" })}
                            className={`w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                errors.firstName ? "border-red-500" : "border-gray-300"
                            } dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100`}
                            placeholder="Enter your first name"
                        />
                        {errors.firstName && (
                            <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="lastName" className="block text-gray-700 dark:text-gray-300">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            {...register("lastName", { required: "Last name is required" })}
                            className={`w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                errors.lastName ? "border-red-500" : "border-gray-300"
                            } dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100`}
                            placeholder="Enter your last name"
                        />
                        {errors.lastName && (
                            <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
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
                        disabled={registerMutation.isLoading}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                        {registerMutation.isLoading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                    Already have an account?{" "}
                    <a
                        href="/login"
                        className="text-blue-500 hover:text-blue-600 font-medium"
                    >
                        Login here
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;
