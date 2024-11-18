"use client";

import React, { useEffect, useState } from "react";
import { useCommentBlogPost } from "@client/hooks/useCommentBlogPost";
import { useBlogPost } from "@client/hooks/useBlogPost";
import { useParams, useRouter } from "next/navigation";
import LoadingSpinnerScreen from "@client/components/loading/LoadingSpinnerScreen";
import { useBlogPostComments } from "@client/hooks/useBlogPostComments";
import { useReportBlogPost } from "@client/hooks/useReportBlogPost";
import { AddCommentRequest } from "@types/dtos/comments";
import { ReportBlogPostRequest } from "@types/dtos/blogPosts";
import { useUser } from "@client/hooks/useUser";
import { FaEdit } from "react-icons/fa";
import BlogPostVote from "@client/components/vote/BlogPostVote";

const BlogPost = () => {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();

    const [newComment, setNewComment] = useState("");
    const [reportReason, setReportReason] = useState("");
    const [isAuthor, setIsAuthor] = useState(false);

    const { blogPost, blogLoading } = useBlogPost(id);
    const { data: user, isLoading: userLoading } = useUser();
    const { comments, commentsLoading } = useBlogPostComments(id);

    const { mutate: addComment } = useCommentBlogPost();
    const { mutate: reportBlogPost } = useReportBlogPost();

    useEffect(() => {
        if (user && blogPost) {
            setIsAuthor(user.id === blogPost.userId);
        }
    }, [user, blogPost]);

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        addComment({ id, content: newComment } as AddCommentRequest);
        setNewComment("");
    };

    const handleReport = () => {
        if (!reportReason.trim()) return alert("Please provide a reason for reporting.");
        reportBlogPost({ id, reason: reportReason } as ReportBlogPostRequest);
        setReportReason("");
    };

    if (blogLoading || commentsLoading || userLoading) {
        return <LoadingSpinnerScreen />;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Blog Post Section */}
            <div className="relative p-6 mb-4 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                {isAuthor && (
                    <button
                        onClick={() => router.push(`/blogs/${blogPost?.id}/edit`)}
                        className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        <FaEdit className="text-lg" />
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
                    <p className="text-blue-600 dark:text-blue-400">{blogPost?.tags.join(", ")}</p>
                </div>
                <BlogPostVote blogPostId={Number(id)} /> {/* Integrated BlogPostVote */}
            </div>

            {/* Comments Section */}
            <div className="p-6 mb-4 rounded-lg shadow-md bg-gray-50 dark:bg-gray-800">
                <h3 className="text-2xl font-bold mb-4">Comments</h3>
                {comments?.map((comment) => (
                    <div
                        key={comment.id}
                        className="mb-4 p-4 rounded-lg shadow bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                    >
                        <strong>User {comment.userId}:</strong>
                        <p>{comment.content}</p>
                        <small className="text-gray-500 dark:text-gray-400">
                            {new Date(comment.createdAt).toLocaleString()}
                        </small>
                    </div>
                ))}
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                    className="w-full p-2 border rounded mb-4 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                    placeholder="Add a comment..."
                />
                <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    Submit
                </button>
            </div>

            {/* Report Section */}
            <div className="p-6 rounded-lg shadow-md bg-red-50 dark:bg-gray-800">
                <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
                    Report Blog Post
                </h3>
                <textarea
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    rows={4}
                    className="w-full p-2 border rounded mb-4 border-red-300 dark:border-red-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                    placeholder="Provide a reason for reporting..."
                />
                <button
                    onClick={handleReport}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Report
                </button>
            </div>
        </div>
    );
};

export default BlogPost;
