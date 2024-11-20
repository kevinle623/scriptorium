"use client";

import React, { useState } from "react";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import { useBlogPostComments } from "@client/hooks/useBlogPostComments";
import { useCommentBlogPost } from "@client/hooks/useCommentBlogPost";
import LoadingSpinner from "@client/components/loading/LoadingSpinner";
import { useToaster } from "@client/providers/ToasterProvider";
import {useJitOnboarding} from "@client/providers/JitOnboardingProvider";
import {AxiosError} from "axios";

interface CommentSectionProps {
    blogPostId: string;
}

const CommentSection = ({ blogPostId }: CommentSectionProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const { triggerOnboarding } = useJitOnboarding()
    const limit = 10;

    const { comments, totalCount, commentsLoading } = useBlogPostComments({
        blogPostId,
        page: currentPage,
        limit,
    });

    const { mutate: addComment, isPending: addingComment } = useCommentBlogPost();
    const { setToaster } = useToaster();

    const handleAddComment = (content: string) => {
        triggerOnboarding(() => addComment(
            { id: blogPostId, content },
            {
                onSuccess: () => {
                    setToaster("Comment added successfully!", "success");
                    setCurrentPage(1);
                },
                onError: (error) => {
                    const axiosError = error as AxiosError<{ error: string }>;
                    const errorMessage = axiosError.response?.data?.error
                    setToaster(errorMessage || "Comment failed to be added.", "error");
                    console.error("Error adding comment:", errorMessage);
                },
            }
        ));
    };

    const handleNextPage = () => {
        if (currentPage * limit < (totalCount || 0)) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    if (commentsLoading && currentPage === 1) return <LoadingSpinner />;

    return (
        <div className="p-6 mb-4 rounded-lg shadow-md bg-gray-50 dark:bg-gray-800">
            <h3 className="text-2xl font-bold mb-4">Comments</h3>
            <CommentForm
                value=""
                onSubmit={handleAddComment}
                onChange={() => {}}
                placeholder="Add a comment..."
                disableButton={addingComment}
            />
            <hr/>
            {(comments?.length || 0) > 0 ? (
                <>
                    <div className="flex justify-between mt-4 mb-4">

                        <button
                            onClick={handlePrevPage}
                            className="py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50"
                            disabled={currentPage === 1 || commentsLoading}
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNextPage}
                            className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
                            disabled={currentPage * limit >= (totalCount || 0) || commentsLoading}
                        >
                            Next
                        </button>
                    </div>
                    {comments?.map((comment) => (
                        <Comment key={comment.id} comment={comment}/>
                    ))}
                    <div className="flex justify-between mt-4">

                        <button
                            onClick={handlePrevPage}
                            className="py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50"
                            disabled={currentPage === 1 || commentsLoading}
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNextPage}
                            className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
                            disabled={currentPage * limit >= (totalCount || 0) || commentsLoading}
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <p>No comments yet. Be the first to comment!</p>
            )}
        </div>
    );
};

export default CommentSection;
