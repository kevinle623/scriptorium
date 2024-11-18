"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { useBlogPost } from "@client/hooks/useBlogPost";
import { useEditBlogPost } from "@client/hooks/useEditBlogPost";
import { useDeleteBlogPost } from "@client/hooks/useDeleteBlogPost";
import TagInput from "@client/components/tag-input/TagInput";
import LoadingSpinnerScreen from "@client/components/loading/LoadingSpinnerScreen";
import { useToaster } from "@client/providers/ToasterProvider";
import { useUser } from "@client/hooks/useUser";

interface EditBlogPostForm {
    title: string;
    description: string;
    content: string;
    tags: string[];
    codeTemplateIds: string[];
}

const EditBlogPostPage = () => {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const { setToaster } = useToaster();

    const { blogPost, blogLoading } = useBlogPost(id);
    const { data: user, isLoading: userLoading } = useUser();
    const { mutate: editBlogPost, isLoading: isUpdating } = useEditBlogPost();
    const { mutate: deleteBlogPost, isLoading: isDeleting } = useDeleteBlogPost();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<EditBlogPostForm>();

    const tags = watch("tags") || [];
    const codeTemplateIds = watch("codeTemplateIds") || [];

    useEffect(() => {
        if (blogPost) {
            setValue("title", blogPost.title);
            setValue("description", blogPost.description);
            setValue("content", blogPost.content);
            setValue("tags", blogPost.tags || []);
            setValue("codeTemplateIds", blogPost.codeTemplateIds || []);
        }
    }, [blogPost, setValue]);

    useEffect(() => {
        if (user && blogPost) {
            if (user.id !== blogPost.userId) {
                setToaster("Not authorized to edit this blog post. Redirecting...", "error");
                router.push(`/blogs/${blogPost.id}`);
            }
        }
    }, [user, blogPost]);

    const onSubmit = (formData: EditBlogPostForm) => {
        editBlogPost(
            { blogPostId: parseInt(id, 10), ...formData },
            {
                onSuccess: () => {
                    setToaster("Blog post updated successfully!", "success");
                    router.push(`/blogs/${id}`);
                },
                onError: (error) => {
                    setToaster(error.message || "Failed to update blog post.", "error");
                },
            }
        );
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this blog post?")) {
            deleteBlogPost(id, {
                onSuccess: () => {
                    setToaster("Blog post deleted successfully!", "success");
                    router.push("/blogs");
                },
                onError: (error) => {
                    setToaster(error.message || "Failed to delete blog post.", "error");
                },
            });
        }
    };

    if (blogLoading || userLoading) {
        return <LoadingSpinnerScreen />;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Edit Blog Post</h1>
                <button
                    onClick={() => router.push(`/blogs/${id}`)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    Back to Blog
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium">
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        {...register("title", { required: "Title is required" })}
                        className="mt-1 block w-full p-2 border rounded"
                        placeholder="Enter the blog title"
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium">
                        Description
                    </label>
                    <textarea
                        id="description"
                        {...register("description", { required: "Description is required" })}
                        rows={3}
                        className="mt-1 block w-full p-2 border rounded"
                        placeholder="Enter a brief description"
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                </div>

                {/* Content */}
                <div>
                    <label htmlFor="content" className="block text-sm font-medium">
                        Content
                    </label>
                    <textarea
                        id="content"
                        {...register("content", { required: "Content is required" })}
                        rows={6}
                        className="mt-1 block w-full p-2 border rounded"
                        placeholder="Enter the blog content"
                    />
                    {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
                </div>

                {/* Tags */}
                <div>
                    <label htmlFor="tags" className="block text-sm font-medium">
                        Tags
                    </label>
                    <TagInput
                        tags={tags}
                        setTags={(newTags) => setValue("tags", newTags)}
                    />
                </div>

                {/* Code Template IDs */}
                <div>
                    <label htmlFor="codeTemplateIds" className="block text-sm font-medium">
                        Code Template IDs
                    </label>
                    <TagInput
                        tags={codeTemplateIds}
                        setTags={(newIds) => setValue("codeTemplateIds", newIds)}
                    />
                </div>

                {/* Submit and Delete Buttons */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                    >
                        {isDeleting ? "Deleting..." : "Delete Blog Post"}
                    </button>
                    <button
                        type="submit"
                        disabled={isUpdating}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isUpdating ? "Updating..." : "Update Blog Post"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditBlogPostPage;
