"use client";

import React, { useState } from "react";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import { useBlogPostComments } from "@client/hooks/useBlogPostComments";
import { useCommentBlogPost } from "@client/hooks/useCommentBlogPost";
import LoadingSpinner from "@client/components/loading/LoadingSpinner";
import { useToaster } from "@client/providers/ToasterProvider";

interface CommentSectionProps {
    blogPostId: string;
}

const CommentSection = ({ blogPostId }: CommentSectionProps) => {
    const { comments, commentsLoading } = useBlogPostComments(blogPostId);
    const { mutate: addComment, isLoading: addingComment } = useCommentBlogPost();
    const [newComment, setNewComment] = useState("");
    const { setToaster } = useToaster(); // Use toaster context

    const handleAddComment = (content: string) => {
        addComment(
            { id: blogPostId, content },
            {
                onSuccess: () => {
                    setNewComment("");
                    setToaster("Comment added successfully!", "success");
                },
                onError: (error) => {
                    const errorMessage =
                        error.response?.data?.error || "Failed to add comment. Please try again.";
                    setToaster(errorMessage, "error");
                    console.error("Error adding comment:", errorMessage);
                },
            }
        );
    };

    if (commentsLoading) return <LoadingSpinner />;

    return (
        <div className="p-6 mb-4 rounded-lg shadow-md bg-gray-50 dark:bg-gray-800">
            <h3 className="text-2xl font-bold mb-4">Comments</h3>
            <CommentForm
                value={newComment}
                onSubmit={handleAddComment}
                onChange={setNewComment}
                placeholder="Add a comment..."
                disabled={addingComment}
            />
            {comments?.map((comment) => (
                <Comment key={comment.id} comment={comment} />
            ))}
        </div>
    );
};

export default CommentSection;
