"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Editor from "@monaco-editor/react";
import { useRouter } from "next/navigation";
import { useCodeTemplateById } from "@client/hooks/useCodeTemplateById";
import { useCreateCodeTemplate } from "@client/hooks/useCreateCodeTemplate";
import TagInput from "@client/components/tag-input/TagInput";

interface ForkCodeTemplateFormValues {
    title: string;
    explanation: string;
    tags: string[];
}

const ForkCodeTemplatePage = ({ params }: { params: { id: string } }) => {
    const id = parseInt(params.id, 10);
    const { data: codeTemplate, isLoading, error } = useCodeTemplateById(id);
    const { mutate: createTemplate, isLoading: isCreating } = useCreateCodeTemplate();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ForkCodeTemplateFormValues>({
        defaultValues: {
            title: "",
            explanation: "",
            tags: [],
        },
    });

    useEffect(() => {
        if (codeTemplate) {
            setValue("title", `${codeTemplate.title} - (forked)`);
            setValue("explanation", codeTemplate.explanation || "");
            setValue("tags", codeTemplate.tags || []);
        }
    }, [codeTemplate, setValue]);

    const onSubmit = (data: ForkCodeTemplateFormValues) => {
        createTemplate(
            {
                ...data,
                code: codeTemplate?.code || "",
                language: codeTemplate?.language || "javascript",
                parentTemplateId: codeTemplate?.id,
            },
            {
                onSuccess: () => {
                    router.push("/code-templates");
                },
                onError: (error: Error) => {
                    console.error("Error creating forked template:", error.message);
                },
            }
        );
    };

    if (isLoading) {
        return <div className="container mx-auto px-6 py-8">Loading...</div>;
    }

    if (error) {
        return (
            <div className="container mx-auto px-6 py-8 text-red-500">
                Error fetching code template: {error.message}
            </div>
        );
    }

    if (!codeTemplate) {
        return (
            <div className="container mx-auto px-6 py-8">
                No code template found for the given ID.
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-6">Fork Code Template</h1>

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
                        placeholder="Enter a title for your forked code template"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                {/* Explanation */}
                <div>
                    <label htmlFor="explanation" className="block text-lg font-semibold mb-2">
                        Explanation
                    </label>
                    <textarea
                        {...register("explanation")}
                        id="explanation"
                        rows={4}
                        className="w-full border rounded-lg p-2"
                        placeholder="Explain what this code does"
                    />
                </div>

                {/* Tags */}
                <div>
                    <label htmlFor="tags" className="block text-lg font-semibold mb-2">
                        Tags
                    </label>
                    <TagInput
                        tags={codeTemplate.tags || []}
                        setTags={(newTags) => setValue("tags", newTags)}
                    />
                </div>

                {/* Code Preview */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Code Preview</h2>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                        <h3 className="text-md font-semibold mb-2">Language: {codeTemplate.language}</h3>
                        <Editor
                            height="300px"
                            language={codeTemplate.language}
                            value={codeTemplate.code}
                            options={{ readOnly: true }}
                            theme="vs-dark"
                        />
                    </div>
                </div>

                {/* Submit */}
                <div>
                    <button
                        type="submit"
                        disabled={isCreating}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isCreating ? "Saving..." : "Fork Code Template"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ForkCodeTemplatePage;
