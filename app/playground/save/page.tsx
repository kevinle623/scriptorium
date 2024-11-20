"use client";

import React from "react";
import { useForm } from "react-hook-form";
import Editor from "@monaco-editor/react";
import { useRouter } from "next/navigation";
import { useCreateCodeTemplate } from "@client/hooks/useCreateCodeTemplate";
import { useCodePlaygroundCache } from "@client/providers/CodePlaygroundCacheProvider";
import TagInput from "@client/components/tag-input/TagInput";
import {CodingLanguage} from "@/types/dtos/codeTemplates";

interface CreateCodeTemplateFormValues {
    title: string;
    explanation: string;
    tags: string[];
}

const CreateCodeTemplatePage = () => {
    const router = useRouter();
    const { language, code, resetPlayground } = useCodePlaygroundCache();
    const { mutate: createTemplate, isPending: isLoading } = useCreateCodeTemplate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateCodeTemplateFormValues>({
        defaultValues: {
            title: "",
            explanation: "",
            tags: [],
        },
    });

    const onSubmit = (data: CreateCodeTemplateFormValues) => {
        createTemplate(
            {
                ...data,
                language: language as CodingLanguage,
                code,
                tags: tags
            },
            {
                onSuccess: () => {
                    resetPlayground()
                    router.push("/code-templates");
                },
                onError: (error: Error) => {
                    console.error("Error creating template:", error.message);
                },
            }
        );
    };

    const [tags, setTags] = React.useState<string[]>([]);

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Create Code Template</h1>
                <button
                    onClick={() => router.push("/playground")}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                    Back to Playground
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-lg font-semibold mb-2">
                        Title
                    </label>
                    <input
                        {...register("title", { required: "Title is required" })}
                        id="title"
                        type="text"
                        className="w-full border rounded-lg p-2"
                        placeholder="Enter a title for your code template"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                {/* Explanation */}
                <div>
                    <label htmlFor="explanation" className="block text-lg font-semibold mb-2">
                        Explanation
                    </label>
                    <textarea
                        {...register("explanation", { required: "Explanation is required" })}
                        id="explanation"
                        rows={4}
                        className="w-full border rounded-lg p-2"
                        placeholder="Explain what this code does"
                    />
                    {errors.explanation && (
                        <p className="text-red-500 text-sm mt-1">{errors.explanation.message}</p>
                    )}
                </div>

                {/* Tags */}
                <div>
                    <label htmlFor="tags" className="block text-lg font-semibold mb-2">
                        Tags
                    </label>
                    <TagInput tags={tags} setTags={setTags} />
                </div>

                {/* Preview */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Code Preview</h2>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                        <h3 className="text-md font-semibold mb-2">Language: {language}</h3>
                        <Editor
                            height="300px"
                            language={language}
                            value={code}
                            options={{ readOnly: true }}
                            theme="vs-dark"
                        />
                    </div>
                </div>

                {/* Submit */}
                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isLoading ? "Saving..." : "Save Code Template"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateCodeTemplatePage;
