"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useExecuteCode } from "@client/hooks/useExecuteCode";
import { useToaster } from "@client/providers/ToasterProvider";
import Editor from "@monaco-editor/react";
import { useCodeTemplateById } from "@client/hooks/useCodeTemplateById";
import { useUpdateCodeTemplate } from "@client/hooks/useEditCodeTemplate";
import { useDeleteCodeTemplate } from "@client/hooks/useDeleteCodeTemplate";
import { useUser } from "@client/hooks/useUser";
import LoadingSpinnerScreen from "@client/components/loading/LoadingSpinnerScreen";
import {CodingLanguage} from "@/types/dtos/codeTemplates";
import {AxiosError} from "axios";


const EditCodeTemplatePage = () => {
    const { id } = useParams() as { id: string };
    const router = useRouter();

    const { resolvedTheme } = useTheme();
    const [editorTheme, setEditorTheme] = useState<"vs-dark" | "vs-light">("vs-dark");

    const { data: codeTemplate, isLoading: isLoadingTemplate } = useCodeTemplateById(Number(id));
    const { mutate: updateCodeTemplate, isPending: isUpdating } = useUpdateCodeTemplate();
    const { mutate: deleteCodeTemplate, isPending: isDeleting } = useDeleteCodeTemplate();
    const { mutate: executeCode, isPending } = useExecuteCode();
    const { data: user, isLoading: userLoading } = useUser();
    const { setToaster } = useToaster();

    const [title, setTitle] = useState<string>("");
    const [language, setLanguage] = useState<CodingLanguage>(CodingLanguage.JAVASCRIPT);
    const [code, setCode] = useState<string>("");
    const [explanation, setExplanation] = useState<string>("");
    const [tags, setTags] = useState<string[]>([]);
    const [stdin, setStdin] = useState<string>("");
    const [output, setOutput] = useState<string | null>(null);

    useEffect(() => {
        setEditorTheme(resolvedTheme === "light" ? "vs-light" : "vs-dark");
    }, [resolvedTheme]);

    useEffect(() => {
        if (codeTemplate) {
            setTitle(codeTemplate.title);
            setLanguage(codeTemplate.language as CodingLanguage);
            setCode(codeTemplate.code);
            setExplanation(codeTemplate.explanation);
            setTags(codeTemplate.tags);
        }
    }, [codeTemplate]);

    useEffect(() => {
        if (user && codeTemplate) {
            if (user.id !== codeTemplate.userId) {
                setToaster("Not authorized to edit this code template. Redirecting...", "error");
                router.push(`/code-templates/${id}`);
            }
        }
    }, [user, codeTemplate, id, router, setToaster]);

    const handleUpdate = () => {
        updateCodeTemplate(
            { id: Number(id), title, language, code, explanation, tags },
            {
                onSuccess: () => {
                    setToaster("Code template updated successfully!", "success");
                    router.push(`/code-templates/${id}`);
                },
                onError: (error: Error) => {
                    setToaster(error.message || "Failed to update code template.", "error");
                },
            }
        );
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this code template?")) {
            deleteCodeTemplate(Number(id), {
                onSuccess: () => {
                    setToaster("Code template deleted successfully!", "success");
                    router.push("/code-templates");
                },
                onError: (error: Error) => {
                    setToaster(error.message || "Failed to delete code template.", "error");
                },
            });
        }
    };

    const handleExecute = () => {
        executeCode(
            { language, code, stdin },
            {
                onSuccess: (data) => {
                    setOutput(data.result);
                    setToaster("Code executed successfully!", "success");
                },
                onError: (error: unknown) => {
                    let errorMessage = "Error executing code.";

                    if (error && typeof error === "object" && "message" in error) {
                        errorMessage = (error as Error).message;
                    }

                    if (error && (error as AxiosError).isAxiosError) {
                        const axiosError = error as AxiosError<{ error: string }>;
                        errorMessage = axiosError.response?.data?.error || errorMessage;
                    }

                    setOutput(errorMessage);
                    setToaster(errorMessage, "error");
                },
            }
        );
    };

    if (isLoadingTemplate || userLoading) {
        return <LoadingSpinnerScreen />;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Edit Code Template</h1>
                <button
                    onClick={() => router.push(`/code-templates/${id}`)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    Back to Template
                </button>
            </div>

            <div className="space-y-4">
                {/* Title */}
                <div>
                    <label className="block text-lg font-semibold mb-2">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border rounded p-2 w-full"
                    />
                </div>

                {/* Language */}
                <div>
                    <label className="block text-lg font-semibold mb-2">Language</label>
                    <select
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

                {/* Explanation */}
                <div>
                    <label className="block text-lg font-semibold mb-2">Explanation</label>
                    <textarea
                        value={explanation}
                        onChange={(e) => setExplanation(e.target.value)}
                        rows={4}
                        className="border rounded p-2 w-full"
                    />
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-lg font-semibold mb-2">Tags (comma-separated)</label>
                    <input
                        type="text"
                        value={tags.join(", ")}
                        onChange={(e) => setTags(e.target.value.split(",").map((tag) => tag.trim()))}
                        className="border rounded p-2 w-full"
                    />
                </div>

                {/* Code */}
                <div>
                    <label className="block text-lg font-semibold mb-2">Code</label>
                    <Editor
                        height="300px"
                        language={language}
                        value={code}
                        onChange={(value) => setCode(value || "")}
                        theme={editorTheme}
                    />
                </div>

                {/* Run Code Section */}
                <div className="space-y-4">
                    <label className="block text-lg font-semibold">Standard Input</label>
                    <textarea
                        value={stdin}
                        onChange={(e) => setStdin(e.target.value)}
                        rows={4}
                        className="w-full p-2 border rounded"
                        placeholder="Input for your code"
                    />
                    <button
                        onClick={handleExecute}
                        disabled={isPending}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isPending ? "Executing..." : "Run Code"}
                    </button>
                    <div>
                        <h2 className="text-lg font-semibold mt-4">Output</h2>
                        <pre className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-4 rounded max-h-64 overflow-auto">
                            {output || "No output yet"}
                        </pre>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-6">
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                    >
                        {isDeleting ? "Deleting..." : "Delete Template"}
                    </button>
                    <button
                        onClick={handleUpdate}
                        disabled={isUpdating}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                    >
                        {isUpdating ? "Updating..." : "Update Template"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCodeTemplatePage;
