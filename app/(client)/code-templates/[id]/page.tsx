"use client";

import React, { useEffect, useState } from "react";
import { useCodeTemplateById } from "@client/hooks/codeTemplates/useCodeTemplateById";
import { useExecuteCode } from "@client/hooks/codeTemplates/useExecuteCode";
import LoadingSpinnerScreen from "@client/components/loading/LoadingSpinnerScreen";
import { useRouter } from "next/navigation";
import { useJitOnboarding } from "@client/providers/JitOnboardingProvider";
import { useCodePlaygroundCache } from "@client/providers/CodePlaygroundCacheProvider";
import { useUser } from "@client/hooks/users/useUser";
import { FaEdit } from "react-icons/fa";
import UserProfileSection from "@client/components/user/UserProfileSection";
import {CodingLanguage} from "@/types/dtos/codeTemplates";
import {useAuth} from "@client/providers/AuthProvider";
import useMobileDetect from "@client/hooks/utilities/useMobileDetect";

const CodeTemplatePage = ({ params }: { params: { id: string } }) => {
    const id = parseInt(params.id, 10);
    const isMobile = useMobileDetect()
    const router = useRouter();
    const { isAuthed } = useAuth()
    const { triggerOnboarding } = useJitOnboarding();
    const { setCode, setLanguage, resetPlayground } = useCodePlaygroundCache();
    const [isAuthor, setIsAuthor] = useState(false);

    const { data: codeTemplate, isLoading, error } = useCodeTemplateById(id);
    const { data: user, isLoading: userLoading } = useUser();
    const { mutate: executeCode, data: executeResponse, isPending: isExecuting } = useExecuteCode();

    const [stdin, setStdin] = useState("");

    useEffect(() => {
        if (user && codeTemplate && isAuthed) {
            setIsAuthor(user.id === codeTemplate.userId);
        } else {
            setIsAuthor(false);
        }
    }, [user, codeTemplate, isAuthed]);

    const handleFork = () => {
        triggerOnboarding(() => router.push(`/code-templates/${id}/fork`));
    };

    const handleCopyToPlayground = () => {
        resetPlayground();
        if (codeTemplate && codeTemplate?.code && codeTemplate?.language) {
            setCode(codeTemplate?.code);
            setLanguage(codeTemplate?.language);
        }
        router.push(`/playground`);
    };

    const handleRunCode = () => {
        if (!codeTemplate) return;

        executeCode({
            code: codeTemplate.code,
            language: codeTemplate.language as CodingLanguage,
            stdin,
        });
    };

    if (isLoading || userLoading) {
        return <LoadingSpinnerScreen />;
    }

    if (error) {
        return <div className="text-center text-red-500 py-8">Error: {error.message}</div>;
    }

    if (!codeTemplate) {
        return <div className="text-center py-8">No template found</div>;
    }

    const { title, code, language, explanation, tags, userId, parentTemplateId } = codeTemplate;

    return (
        <div className="container mx-auto px-6 py-8">
            {parentTemplateId && (
                <div className="bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 p-4 rounded-lg mb-4">
                    <p>
                        This is a forked code template. View the original{" "}
                        <a
                            href={`/code-templates/${parentTemplateId}`}
                            className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-600"
                        >
                            code template
                        </a>
                        .
                    </p>
                </div>
            )}
            <div className={`flex ${isMobile ? "flex-col" : "justify-between items-center"} mb-4 gap-4`}>
                <h1 className={`text-3xl font-bold ${isMobile ? "text-center" : ""}`}>{title}</h1>
                <div className={`flex ${isMobile ? "flex-col" : "gap-4"} ${isMobile ? "items-stretch" : ""}`}>
                    <button
                        onClick={handleFork}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        Fork Template
                    </button>
                    <button
                        onClick={handleCopyToPlayground}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Copy to Playground
                    </button>
                    {isAuthor && (
                        <button
                            onClick={() => router.push(`/code-templates/${id}/edit`)}
                            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                        >
                            <FaEdit/>
                            Edit Template
                        </button>
                    )}
                </div>
            </div>
            <div className="text-gray-600 dark:text-gray-300 mb-6">Language: {language}</div>

            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
                <h2 className="text-xl font-bold mb-2">Code</h2>
                <pre
                    className="overflow-x-auto whitespace-pre-wrap bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md text-sm">
                    {code}
                </pre>
            </div>

            {userId &&
                <div className="mb-6">
                    <UserProfileSection userId={String(userId)} sectionName="Author"/>
                </div>}

            {explanation && (
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
                    <h2 className="text-xl font-bold mb-2">Explanation</h2>
                    <p className="text-gray-700 dark:text-gray-300">{explanation}</p>
                </div>
            )}

            <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Tags</h2>
                <div className="flex gap-2 flex-wrap">
                    {tags?.map((tag) => (
                        <span
                            key={tag}
                            className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Run Code</h2>
                <textarea
                    className="w-full h-24 p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    placeholder="Provide stdin here..."
                    value={stdin}
                    onChange={(e) => setStdin(e.target.value)}
                />
                <button
                    onClick={handleRunCode}
                    disabled={isExecuting}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                    {isExecuting ? "Running..." : "Run Code"}
                </button>
            </div>

            {executeResponse && (
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
                    <h2 className="text-xl font-bold mb-2">Output</h2>
                    <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                        {executeResponse.result || "No output"}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default CodeTemplatePage;
