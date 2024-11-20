import React from "react";
import {useJitOnboarding} from "@client/providers/JitOnboardingProvider";

interface CommentFormProps {
    value: string;
    onSubmit: (content: string) => void;
    onChange: (value: string) => void;
    placeholder?: string;
}

const CommentForm = ({ value, onSubmit, onChange, placeholder }: CommentFormProps) => {
    const { triggerOnboarding } = useJitOnboarding()
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            triggerOnboarding(() => onSubmit(value.trim()));
            onChange("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={3}
                className="w-full p-2 border rounded mb-4 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                placeholder={placeholder || "Write a comment..."}
            />
            <button
                type="submit"
                disabled={!value.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
                Submit
            </button>
        </form>
    );
};

export default CommentForm;
