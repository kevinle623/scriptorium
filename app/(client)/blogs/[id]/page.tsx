"use client";

import React, { useEffect, useState } from "react";
import { useBlogPost } from "@client/hooks/blogs/useBlogPost";
import { useParams, useRouter } from "next/navigation";
import LoadingSpinnerScreen from "@client/components/loading/LoadingSpinnerScreen";
import { useUser } from "@client/hooks/users/useUser";
import { FaEdit } from "react-icons/fa";
import BlogPostVote from "@client/components/vote/BlogPostVote";
import CommentSection from "@client/components/comment/CommentSection";
import BlogPostReportForm from "@client/components/report/BlogPostReportForm";
import { useCodeTemplates } from "@client/hooks/codeTemplates/useCodeTemplates";
import Link from "next/link";
import UserProfileSection from "@client/components/user/UserProfileSection";
import {useAuth} from "@client/providers/AuthProvider";

const BlogPost = () => {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();

    const { isAuthed } = useAuth()
    const [isAuthor, setIsAuthor] = useState(false);

    const { blogPost, blogLoading } = useBlogPost(id);
    const { data: user, isLoading: userLoading } = useUser();

    const { data: codeTemplateData, isLoading: codeTemplateLoading } = useCodeTemplates({
        ids: blogPost?.codeTemplateIds ? blogPost.codeTemplateIds.join(",") : undefined,
    });

    useEffect(() => {
        if (user && blogPost && isAuthed) {
            setIsAuthor(user.id === blogPost.userId);
        } else {
            setIsAuthor(false)
        }
    }, [user, blogPost, isAuthed]);

    if (blogLoading || userLoading) {
        return <LoadingSpinnerScreen />;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Blog Post Section */}
            <div
                className="relative p-6 mb-4 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                {isAuthor && (
                    <button
                        onClick={() => router.push(`/blogs/${blogPost?.id}/edit`)}
                        className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        <FaEdit className="text-lg"/>
                        Edit
                    </button>
                )}
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
                <BlogPostVote blogPostId={Number(id)}/>
                <BlogPostReportForm blogPostId={id}/>
            </div>

            {blogPost?.userId &&
                <div className="mb-6">
                <UserProfileSection userId={String(blogPost?.userId)} sectionName="Author"/>
            </div>}

            {/* Code Templates Section */}
            {(blogPost?.codeTemplateIds?.length || 0) > 0 && (
                <div className="p-6 mb-4 rounded-lg shadow-md bg-gray-100 dark:bg-gray-700">
                    <h2 className="text-xl font-bold mb-4">Code Templates</h2>
                    {codeTemplateLoading ? (
                        <p>Loading code templates...</p>
                    ) : (
                        <div className="space-y-4">
                            {codeTemplateData?.codeTemplates?.map((template) => (
                                <details
                                    key={template.id}
                                    className="border rounded-lg p-4 bg-white dark:bg-gray-800"
                                >
                                    <summary className="cursor-pointer text-lg font-medium">
                                        {template.title} ({template.language})
                                    </summary>
                                    <pre
                                        className="mt-2 p-4 bg-gray-100 dark:bg-gray-900 rounded text-sm overflow-x-auto">
                                        {template.code}
                                    </pre>
                                    {template.explanation && (
                                        <p className="mt-2 text-gray-700 dark:text-gray-300">
                                            {template.explanation}
                                        </p>
                                    )}
                                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        Created: {new Date(template.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="mt-4">
                                        <Link
                                            href={`/code-templates/${template.id}`}
                                            className="text-blue-500 hover:underline dark:text-blue-400"
                                        >
                                            View Full Template
                                        </Link>
                                    </div>
                                </details>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {blogPost && <CommentSection blogPostId={String(blogPost?.id)}/>}
        </div>
    );
};

export default BlogPost;
