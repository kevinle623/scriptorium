"use client";

import React, { useEffect, useState } from "react";
import { useCommentBlogPost } from "@client/hooks/useCommentBlogPost";
import { useBlogPost } from "@client/hooks/useBlogPost";
import { useParams, useRouter } from "next/navigation";
import LoadingSpinnerScreen from "@client/components/loading/LoadingSpinnerScreen";
import { useBlogPostComments } from "@client/hooks/useBlogPostComments";
import { useUser } from "@client/hooks/useUser";
import { FaEdit } from "react-icons/fa";
import BlogPostVote from "@client/components/vote/BlogPostVote";
import CommentSection from "@client/components/comment/CommentSection";
import BlogPostReport from "@client/components/report/BlogPostReport"; // Import the updated component

const BlogPost = () => {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();

    const [newComment, setNewComment] = useState("");
    const [isAuthor, setIsAuthor] = useState(false);

    const { blogPost, blogLoading } = useBlogPost(id);
    const { data: user, isLoading: userLoading } = useUser();
    const { comments, commentsLoading } = useBlogPostComments(id);

    const { mutate: addComment } = useCommentBlogPost();

    useEffect(() => {
        if (user && blogPost) {
            setIsAuthor(user.id === blogPost.userId);
        }
    }, [user, blogPost]);

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        addComment({ id, content: newComment });
        setNewComment("");
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
                <BlogPostVote blogPostId={Number(id)} />
                <BlogPostReport blogPostId={id} />
            </div>

            <CommentSection blogPostId={blogPost?.id} />
        </div>
    );
};

export default BlogPost;
