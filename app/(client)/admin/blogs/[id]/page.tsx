"use client";

import React, { useEffect, useState } from "react";
import { useBlogPost } from "@client/hooks/blogs/useBlogPost";
import { useParams, useRouter } from "next/navigation";
import LoadingSpinnerScreen from "@client/components/loading/LoadingSpinnerScreen";
import { FaEdit } from "react-icons/fa";
import { useHideBlogPost } from "@client/hooks/blogs/useHideBlogPost";
import BlogPostVote from "@client/components/vote/BlogPostVote";
import CommentSection from "@client/components/comment/CommentSection";
import { useToaster } from "@client/providers/ToasterProvider";
import {AxiosError} from "axios";
import BlogPostReportsSection from "@client/components/report/BlogPostReportsSection";

const AdminBlogPost = () => {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();

    const { blogPost, blogLoading } = useBlogPost(id);
    const { mutate: toggleHiddenStatus, isPending: toggling } = useHideBlogPost();
    const { setToaster } = useToaster();
    const [isHidden, setIsHidden] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        if (blogPost) {
            setIsHidden(blogPost.hidden);
        }
    }, [blogPost]);

    const handleToggleHiddenStatus = () => {
        if (!blogPost) return;

        toggleHiddenStatus(
            { hidden: !isHidden!, blogPostId: id },
            {
                onSuccess: (data) => {
                    setIsHidden(data.hidden);
                    setToaster(
                        `Blog post is now ${data.hidden ? "hidden" : "visible"}`,
                        "success"
                    );
                },
                onError: (error: unknown) => {
                    if ((error as AxiosError).isAxiosError) {
                        const axiosError = error as AxiosError<{ error: string }>;
                        const errorMessage =
                            axiosError.response?.data?.error || "An unexpected error occurred";
                        setToaster(errorMessage, "error");
                        console.error("Failed to toggle hidden status:", errorMessage);
                    } else {
                        const errorMessage = "An unexpected error occurred";
                        setToaster(errorMessage, "error");
                        console.error("Failed to toggle hidden status:", error);
                    }
                },
            }
        );
    };

    if (blogLoading) {
        return <LoadingSpinnerScreen />;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Back Button */}
            <div className="mb-4">
                <button
                    onClick={() => router.push("/admin/blogs")}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                    Back to Blogs
                </button>
            </div>

            {/* Blog Post Section */}
            <div className="relative p-6 mb-4 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <div className="absolute top-4 right-4 flex items-center space-x-4">
                    <button
                        onClick={handleToggleHiddenStatus}
                        disabled={toggling}
                        className={`px-4 py-2 rounded text-white ${
                            isHidden
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-green-500 hover:bg-green-600"
                        }`}
                    >
                        {toggling
                            ? "Updating..."
                            : isHidden
                                ? "Unhide Post"
                                : "Hide Post"}
                    </button>
                    <button
                        onClick={() => router.push(`/blogs/${blogPost?.id}/edit`)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        <FaEdit className="text-lg" />
                        Edit
                    </button>
                </div>
                <h1 className="text-3xl font-bold mb-2">{blogPost?.title}</h1>
                <p className="mb-4">{blogPost?.description}</p>
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Content:</h2>
                    <p>{blogPost?.content}</p>
                </div>
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Tags:</h2>
                    <p className="text-blue-600 dark:text-blue-400">{blogPost?.tags?.join(", ")}</p>
                </div>
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Visibility Status:</h2>
                    <p
                        className={`font-bold ${
                            isHidden ? "text-red-500" : "text-green-500"
                        }`}
                    >
                        {isHidden ? "Hidden" : "Visible"}
                    </p>
                </div>
                <BlogPostVote blogPostId={Number(id)} />
            </div>

            {blogPost && <BlogPostReportsSection blogPostId={blogPost.id} />}

            <CommentSection blogPostId={blogPost?.id ? String(blogPost.id) : ""} />
        </div>
    );
};

export default AdminBlogPost;
