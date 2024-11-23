"use client";

import React, { useEffect, useState } from "react";
import { useComment } from "@client/hooks/comments/useComment";
import { useParams, useRouter } from "next/navigation";
import LoadingSpinnerScreen from "@client/components/loading/LoadingSpinnerScreen";
import { useHideComment } from "@client/hooks/comments/useHideComment";
import { useCommentReplies } from "@client/hooks/comments/useCommentReplies";
import { useToaster } from "@client/providers/ToasterProvider";
import CommentVote from "@client/components/vote/CommentVote";
import Reply from "@client/components/comment/Comment";
import {AxiosError} from "axios";
import CommentReportsSection from "@client/components/report/CommentReportsSection";
import UserProfileSection from "@client/components/user/UserProfileSection";

const AdminComment = () => {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();

    const { comment, commentLoading } = useComment(id);
    const { mutate: toggleHiddenStatus, isPending: toggling } = useHideComment();
    const { setToaster } = useToaster();

    const [isHidden, setIsHidden] = useState<boolean | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState(1);
    const [isRepliesVisible, setIsRepliesVisible] = useState(false);
    const limit = 5;

    const { replies, repliesLoading, totalCount = 0 } = useCommentReplies({
        commentId: id,
        page: currentPage,
        limit,
    });

    useEffect(() => {
        if (comment) {
            setIsHidden(comment.hidden);
        }
    }, [comment]);

    const handleToggleHiddenStatus = () => {
        if (!comment) return;

        toggleHiddenStatus(
            { hidden: !isHidden!, commentId: comment.id },
            {
                onSuccess: (data) => {
                    setIsHidden(data.hidden);
                    setToaster(
                        `Comment is now ${data.hidden ? "hidden" : "visible"}`,
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

    if (commentLoading) {
        return <LoadingSpinnerScreen />;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Back Button */}
            <div className="mb-4">
                <button
                    onClick={() => router.push("/admin/comments")}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                    Back to Comments
                </button>
            </div>

            {/* Comment Section */}
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
                                ? "Unhide Comment"
                                : "Hide Comment"}
                    </button>
                </div>
                <h1 className="text-xl font-bold mb-2">Comment Details</h1>
                <p className="mb-4 text-gray-700 dark:text-gray-300">{comment?.content}</p>
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
                {comment && <CommentVote commentId={comment.id} />}
            </div>

            {comment?.userId &&
                <div className="mb-6">
                    <UserProfileSection userId={String(comment?.userId)} sectionName="Author"/>
                </div>}

            {comment && <CommentReportsSection commentId={comment.id} />}

            {/* Replies Section */}
            <div className="mt-4">
                {repliesLoading ? (
                    <p className="text-gray-500 dark:text-gray-400">Loading replies...</p>
                ) : replies && replies.length > 0 ? (
                    <>
                        <button
                            onClick={() => setIsRepliesVisible(!isRepliesVisible)}
                            className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 transition"
                        >
                            {isRepliesVisible
                                ? "Hide Replies"
                                : `View Replies (${totalCount})`}
                        </button>
                        {isRepliesVisible && (
                            <div className="mt-4 ml-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                                {replies.map((reply) => (
                                    <Reply key={reply.id} comment={reply} />
                                ))}
                                <div className="flex justify-between mt-4">
                                    <button
                                        onClick={handlePrevPage}
                                        className="py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50"
                                        disabled={currentPage === 1 || repliesLoading}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={handleNextPage}
                                        className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
                                        disabled={currentPage * limit >= (totalCount || 0) || repliesLoading}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">No replies for this comment.</p>
                )}
            </div>
        </div>
    );
};

export default AdminComment;
