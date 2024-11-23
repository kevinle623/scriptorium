"use client";

import React, { useEffect, useState } from "react";
import { useExecuteCode } from "@client/hooks/codeTemplates/useExecuteCode";
import { useCodePlaygroundCache } from "@client/providers/CodePlaygroundCacheProvider";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useJitOnboarding } from "@client/providers/JitOnboardingProvider";
import {CodingLanguage} from "@/types/dtos/codeTemplates";
import axios from "axios";
import {useToaster} from "@client/providers/ToasterProvider";

const Playground = () => {
    const { language, code, setLanguage, setCode, resetPlayground } = useCodePlaygroundCache();
    const [stdin, setStdin] = useState("");
    const [output, setOutput] = useState<string | null>(null);
    const { mutate: executeCode, isPending } = useExecuteCode();
    const { resolvedTheme } = useTheme();
    const [editorTheme, setEditorTheme] = useState("vs-dark");
    const router = useRouter();
    const { triggerOnboarding } = useJitOnboarding();
    const { setToaster } = useToaster()

    useEffect(() => {
        setEditorTheme(resolvedTheme === "light" ? "vs-light" : "vs-dark");
    }, [resolvedTheme]);

    const handleExecute = () => {
        executeCode(
            { language: language as CodingLanguage, code, stdin },
            {
                onSuccess: (data) => {
                    setToaster("Code ran successfully!", "success")
                    setOutput(data.result);
                },
                onError: (error: unknown) => {
                    setToaster("Ran into an error running the code...", "error")
                    if (axios.isAxiosError(error)) {
                        const errorMessage =
                            error.response?.data?.error || "An unexpected error occurred";
                        setOutput(errorMessage);
                        console.error("Failed to toggle hidden status:", errorMessage);
                    } else {
                        setOutput("Runtime max timeout reached or unexpected interruption.");
                    }
                },
            }
        );
    };

    const handleSaveAsTemplate = () => {
        triggerOnboarding(() => router.push("/playground/save"));
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Code Playground</h1>
                <div className="flex gap-4">
                    <button
                        onClick={resetPlayground}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Reset Playground
                    </button>
                    <button
                        onClick={handleSaveAsTemplate}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Save as Code Template
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="language" className="block text-lg font-semibold mb-2">
                    Language
                </label>
                <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as CodingLanguage)}
                    className="border rounded p-2 w-full"
                >
                    {Object.entries(CodingLanguage).map(([key, value]) => (
                        <option key={key} value={value}>
                            {key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-lg font-semibold mb-2">Code</label>
                <Editor
                    height="300px"
                    language={language}
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    theme={editorTheme}
                />
            </div>

            <div className="mb-4">
                <label className="block text-lg font-semibold mb-2">Standard Input</label>
                <textarea
                    value={stdin}
                    onChange={(e) => setStdin(e.target.value)}
                    rows={4}
                    className="w-full p-2 border rounded"
                    placeholder="Input for your code"
                />
            </div>

            <button
                onClick={handleExecute}
                disabled={isPending}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
                {isPending ? "Executing..." : "Run Code"}
            </button>

            <div className="mt-4">
                <h2 className="text-lg font-semibold">Output</h2>
                <pre className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-4 rounded max-h-64 overflow-auto">
                    {output || "No output yet"}
                </pre>
            </div>
        </div>
    );
};

export default Playground;
