"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import {CreateBlogPostRequest} from "@types/dtos/blogPosts";
import {useCreateBlogPost} from "@client/hooks/useCreateBlogPost";

const CreateBlogPostPage = () => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateBlogPostRequest>();

    const mutation = useCreateBlogPost();

    const onSubmit: SubmitHandler<CreateBlogPostRequest> = (data) => {
        mutation.mutate(data, {
            onSuccess: () => {
                alert("Blog post created successfully!");
                reset();
                router.push("/blogs");
            },
            onError: (error) => {
                alert(`Error: ${error.message}`);
            },
        });
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-6">Create a New Blog Post</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block mb-2 font-bold">Title</label>
                    <input
                        {...register("title", { required: "Title is required" })}
                        className="border border-gray-300 p-2 rounded-lg w-full"
                    />
                    {errors.title && (
                        <span className="text-red-500">{errors.title.message}</span>
                    )}
                </div>

                <div>
                    <label className="block mb-2 font-bold">Description</label>
                    <textarea
                        {...register("description", {
                            required: "Description is required",
                        })}
                        className="border border-gray-300 p-2 rounded-lg w-full"
                    ></textarea>
                    {errors.description && (
                        <span className="text-red-500">{errors.description.message}</span>
                    )}
                </div>

                <div>
                    <label className="block mb-2 font-bold">Content</label>
                    <textarea
                        {...register("content", { required: "Content is required" })}
                        className="border border-gray-300 p-2 rounded-lg w-full"
                    ></textarea>
                    {errors.content && (
                        <span className="text-red-500">{errors.content.message}</span>
                    )}
                </div>

                <div>
                    <label className="block mb-2 font-bold">User ID</label>
                    <input
                        {...register("userId", { required: "User ID is required" })}
                        className="border border-gray-300 p-2 rounded-lg w-full"
                        type="number"
                    />
                    {errors.userId && (
                        <span className="text-red-500">{errors.userId.message}</span>
                    )}
                </div>

                <div>
                    <label className="block mb-2 font-bold">Code Template IDs</label>
                    <input
                        {...register("codeTemplateIds")}
                        className="border border-gray-300 p-2 rounded-lg w-full"
                        placeholder="Comma-separated IDs (e.g., 1,2,3)"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-bold">Tags</label>
                    <input
                        {...register("tags")}
                        className="border border-gray-300 p-2 rounded-lg w-full"
                        placeholder="Comma-separated tags"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? "Creating..." : "Create Blog Post"}
                </button>
            </form>
        </div>
    );
};

export default CreateBlogPostPage;