"use client";

import React, { useEffect, useState } from "react";
import { useComment } from "@client/hooks/useComment";
import { useParams, useRouter } from "next/navigation";
import LoadingSpinnerScreen from "@client/components/loading/LoadingSpinnerScreen";
import { useHideComment } from "@client/hooks/useHideComment";
import { useCommentReplies } from "@client/hooks/useCommentReplies";
import { useToaster } from "@client/providers/ToasterProvider";
import CommentVote from "@client/components/vote/CommentVote";
import Reply from "@client/components/comment/Comment"

const AdminComment = () => {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();

    const { comment, commentLoading } = useComment(id);
    const { mutate: toggleHiddenStatus, isLoading: toggling } = useHideComment();
    const { replies, repliesLoading } = useCommentReplies(Number(id));
    const { setToaster } = useToaster();

    const [isHidden, setIsHidden] = useState<boolean | undefined>(undefined);
    const [isRepliesVisible, setIsRepliesVisible] = useState(false);

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
                onError: (error: any) => {
                    const errorMessage = error.response?.data?.error || "An unexpected error occurred";
                    setToaster(errorMessage, "error");
                    console.error("Failed to toggle hidden status:", errorMessage);
                },
            }
        );
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
                    <h2 className="text-lg font-semibold">Author:</h2>
                    <p className="text-blue-600 dark:text-blue-400">User {comment?.userId}</p>
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
                <CommentVote commentId={comment.id} />
            </div>

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
                            {isRepliesVisible ? "Hide Replies" : `View Replies (${replies.length})`}
                        </button>
                        {isRepliesVisible && (
                            <div className="mt-4 ml-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                                {replies.map((reply) => (
                                    <Reply comment={reply}  />
                                ))}
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
