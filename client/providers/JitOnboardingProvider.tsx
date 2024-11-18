"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import Login from "@client/components/onboarding/Login";
import Register from "@client/components/onboarding/Register";
import { useAuth } from "@client/providers/AuthProvider";

type OnboardingStep = "login" | "register";

interface JitOnboardingContextValue {
    triggerOnboarding: (nextAction: () => void, step?: OnboardingStep) => void;
}

const JitOnboardingContext = createContext<JitOnboardingContextValue | undefined>(undefined);

export const useJitOnboarding = () => {
    const context = useContext(JitOnboardingContext);
    if (!context) {
        throw new Error("useJitOnboarding must be used within a JitOnboardingProvider");
    }
    return context;
};

interface JitOnboardingProviderProps {
    children: ReactNode;
}

export const JitOnboardingProvider = ({ children }: JitOnboardingProviderProps) => {
    const { isAuthed, isInitialized } = useAuth();
    const [onboardingAction, setOnboardingAction] = useState<(() => void) | null>(null);
    const [step, setStep] = useState<OnboardingStep | null>(null);
    const router = useRouter();

    useEffect(() => {
        const handleRouteChange = () => {
            setStep(null);
            setOnboardingAction(null);
        };

        router.events.on("routeChangeStart", handleRouteChange);

        return () => {
            router.events.off("routeChangeStart", handleRouteChange);
        };
    }, [router]);

    useEffect(() => {
        if (isAuthed) {
            setStep(null);
        }
    }, [isAuthed]);

    const handleSuccess = () => {
        if (onboardingAction) onboardingAction();
        setStep(null);
        setOnboardingAction(null);
    };

    const handleCancel = () => {
        setStep(null);
        setOnboardingAction(null);
    };

    const triggerOnboarding = (nextAction: () => void, step: OnboardingStep = "login") => {
        if (isInitialized && isAuthed) {
            nextAction();
            return;
        }
        setOnboardingAction(() => nextAction);
        setStep(step);
    };

    if (step) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
                <div className="rounded-lg p-6 max-w-lg">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
                        In order to perform this action, you must be authenticated.
                    </h2>
                    <div className="space-y-6">
                        {step === "login" ? (
                            <Login
                                onSuccess={handleSuccess}
                                toggleRegister={() => setStep("register")}
                            />
                        ) : (
                            <Register
                                onSuccess={handleSuccess}
                                toggleLogin={() => setStep("login")}
                            />
                        )}
                    </div>
                    <div className="mt-6 text-center">
                        <button
                            onClick={handleCancel}
                            className="inline-block px-6 py-2 text-sm font-medium bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <JitOnboardingContext.Provider value={{ triggerOnboarding }}>
            {children}
        </JitOnboardingContext.Provider>
    );
};
