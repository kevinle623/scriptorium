import React, { useState, useEffect } from 'react';
import { useJitOnboarding } from "@client/providers/JitOnboardingProvider";

interface CommentFormProps {
    onSubmit: (content: string) => void;
    onChange?: (value: string) => void;
    placeholder?: string;
    disableButton?: boolean;
    value?: string;
}

const CommentForm = ({ onSubmit, onChange, placeholder, disableButton, value: prompt }: CommentFormProps) => {
    const { triggerOnboarding } = useJitOnboarding();
    const [value, setValue] = useState('');

    useEffect(() => {
        if (prompt) {
            setValue(prompt);
        }
    }, [prompt]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        triggerOnboarding(() => onSubmit(value.trim()));
        setValue('');
        if (onChange) onChange('');
    };

    const handleChange = (newValue: string) => {
        setValue(newValue);
        if (onChange) onChange(newValue);
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <textarea
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                rows={3}
                className="w-full p-2 border rounded mb-4 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                placeholder={placeholder || "Write a comment..."}
            />
            <button
                type="submit"
                disabled={!value.trim() || disableButton}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
                Submit
            </button>
        </form>
    );
};

export default CommentForm;
