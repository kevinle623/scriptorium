"use client";

import React, { useState, useEffect } from "react";
import { useExecuteCode } from "@client/hooks/useExecuteCode";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";

const Playground = () => {
    const [language, setLanguage] = useState("javascript");
    const [code, setCode] = useState("// Write your code here");
    const [stdin, setStdin] = useState("");
    const [output, setOutput] = useState<string | null>(null);

    const { mutate: executeCode, isLoading, isError, error } = useExecuteCode();

    const { theme } = useTheme();
    const [editorTheme, setEditorTheme] = useState("vs-dark");

    useEffect(() => {
        setEditorTheme(theme === "light" ? "vs-light" : "vs-dark");
    }, [theme]);

    const handleExecute = () => {
        executeCode(
            { language, code, stdin },
            {
                onSuccess: (data) => {
                    setOutput(data.result);
                },
                onError: () => {
                    setOutput("Error executing code.");
                },
            }
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Code Playground</h1>
            <div className="mb-4">
                <label htmlFor="language" className="block text-lg font-semibold mb-2">
                    Language
                </label>
                <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="border rounded p-2 w-full"
                >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="c">C</option>
                    <option value="cpp">C++</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-lg font-semibold mb-2">Code</label>
                <Editor
                    height="300px"
                    language={language}
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    theme={editorTheme} // Dynamically set the editor theme
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
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
                {isLoading ? "Executing..." : "Run Code"}
            </button>

            <div className="mt-4">
                <h2 className="text-lg font-semibold">Output</h2>
                {isError ? (
                    <p className="text-red-500">Error: {error?.message}</p>
                ) : (
                    <pre className="bg-gray-100 p-4 rounded">{output || "No output yet"}</pre>
                )}
            </div>
        </div>
    );
};

export default Playground;
