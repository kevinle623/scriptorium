"use client";

import React, {useEffect, useState} from "react";
import CommentForm from "./CommentForm";
import {Comment as CommentType} from "@/types/dtos/comments";
import {useReportComment} from "@client/hooks/comments/useReportComment";
import {useReplyComment} from "@client/hooks/comments/useReplyComment";
import {useCommentReplies} from "@client/hooks/comments/useCommentReplies";
import {useUserById} from "@client/hooks/users/useUserById";
import CommentVote from "@client/components/vote/CommentVote";
import {useToaster} from "@client/providers/ToasterProvider";
import {useJitOnboarding} from "@client/providers/JitOnboardingProvider";
import {AxiosError} from "axios";
import AvatarImage from "@client/components/avatar/AvatarImage";
import {useAuth} from "@client/providers/AuthProvider";
import {useUser} from "@client/hooks/users/useUser";
import {useDeleteComment} from "@client/hooks/comments/useDeleteComment";
import {FaEdit, FaTrash} from "react-icons/fa";
import {useEditComment} from "@client/hooks/comments/useEditComment";

interface CommentProps {
    comment: CommentType;
}

const Comment = ({comment}: CommentProps) => {
    const {mutate: reportComment} = useReportComment();
    const {mutate: replyToComment} = useReplyComment();
    const {setToaster} = useToaster();
    const {triggerOnboarding} = useJitOnboarding();
    const {isAuthed} = useAuth();
    const {data: sessionUser} = useUser();
    const {mutate: deleteComment} = useDeleteComment();
    const {data: user, isLoading: userLoading, isError: userError} = useUserById(String(comment.userId));
    const [isRepliesVisible, setIsRepliesVisible] = useState(false);
    const [activeForm, setActiveForm] = useState<"reply" | "report" | null>(null);
    const [replyContent, setReplyContent] = useState("");
    const [reportReason, setReportReason] = useState("");
    const [isAuthor, setIsAuthor] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const {mutate: editComment} = useEditComment();

    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const limit = 5;

    const {replies, repliesLoading, totalCount} = useCommentReplies({
        commentId: comment.id,
        page: currentPage,
        limit,
    });

    useEffect(() => {
        if (sessionUser && comment && isAuthed) {
            setIsAuthor(sessionUser.id === comment.userId);
        } else {
            setIsAuthor(false);
        }
    }, [sessionUser, comment, isAuthed]);

    const handleReply = () => {
        if (!replyContent.trim()) {
            setToaster("Please write a reply before submitting.", "info");
            return;
        }
        triggerOnboarding(() =>
            replyToComment(
                {id: String(comment.id), content: replyContent},
                {
                    onSuccess: () => {
                        setReplyContent("");
                        setActiveForm(null);
                        setToaster("Reply submitted successfully!", "success");
                        setCurrentPage(1);
                    },
                    onError: (error) => {
                        const axiosError = error as AxiosError<{ error: string }>;
                        setToaster(axiosError.response?.data?.error || "Failed to reply. Please try again.", "error");
                        setActiveForm(null);
                        console.error(error);
                    },
                }
            )
        );
    };

    const handleReport = () => {
        if (!reportReason.trim()) {
            setToaster("Please provide a reason for reporting.", "info");
            return;
        }
        triggerOnboarding(() =>
            reportComment(
                {id: String(comment.id), reason: reportReason},
                {
                    onSuccess: () => {
                        setReportReason("");
                        setActiveForm(null);
                        setToaster("Comment reported successfully.", "success");
                    },
                    onError: (error) => {
                        const axiosError = error as AxiosError<{ error: string }>;
                        setToaster(axiosError.response?.data?.error || "Failed to report. Please try again.", "error");
                        setActiveForm(null);
                        console.error(error);
                    },
                }
            )
        );
    };

    const toggleForm = (form: "reply" | "report") => {
        setActiveForm(activeForm === form ? null : form);
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

    const handleEdit = () => {
        if (!editContent.trim()) {
            setToaster("Comment content cannot be empty.", "info");
            return;
        }

        editComment(
            {commentId: comment.id, content: editContent},
            {
                onSuccess: () => {
                    setIsEditing(false);
                    setToaster("Comment updated successfully.", "success");
                },
                onError: (error) => {
                    const axiosError = error as AxiosError<{ error: string }>;
                    setToaster(
                        axiosError.response?.data?.error || "Failed to update the comment. Please try again.",
                        "error"
                    );
                },
            }
        );
    };

    const handleDelete = () => {
        const userConfirmed = confirm("Are you sure you want to delete this comment? This action cannot be undone.");
        if (!userConfirmed) return;

        deleteComment(String(comment.id), {
            onSuccess: () => {
                setToaster("Comment deleted successfully.", "success");
            },
            onError: (error) => {
                const axiosError = error as AxiosError<{ error: string }>;
                setToaster(
                    axiosError.response?.data?.error || "Failed to delete the comment. Please try again.",
                    "error"
                );
            },
        });
    };

    return (
        <div className="mb-4 p-4 rounded-lg shadow bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100">
            <div className="flex justify-between">
                <div className="flex items-center space-x-4">
                    <AvatarImage
                        src={user?.avatar}
                        alt="User Avatar"
                        width={45}
                        height={45}
                        className="object-cover rounded-full"
                    />
                    <div>
                        <strong className="text-lg">
                            {userLoading
                                ? "Loading..."
                                : userError || !user
                                    ? `User ${comment.userId}`
                                    : `${user.firstName} ${user.lastName}`}
                        </strong>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {new Date(comment.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>
                {isAuthor && (
                    <div className="flex items-center gap-x-4">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-yellow-500 hover:text-yellow-600 transition"
                        >
                            <FaEdit size={20}/>
                        </button>
                        <button
                            onClick={handleDelete}
                            className="text-red-500 hover:text-red-600 transition"
                        >
                            <FaTrash size={20}/>
                        </button>
                    </div>
                )}
            </div>

            {isEditing ? (
                <div className="mt-4">
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={4}
                        className="w-full p-2 border rounded mb-4 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                        placeholder="Edit your comment..."
                    />
                    <div className="flex gap-x-4">
                        <button
                            onClick={handleEdit}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <p className="mt-4">{comment.content}</p>
            )}

            <div className="mt-4 flex items-center gap-4 text-sm">
                <CommentVote commentId={comment.id}/>
                <button
                    onClick={() => toggleForm("report")}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                    {activeForm === "report" ? "Cancel Report" : "Report"}
                </button>
                <button
                    onClick={() => toggleForm("reply")}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                    {activeForm === "reply" ? "Cancel Reply" : "Reply"}
                </button>
                {(totalCount || 0) > 0 && (
                    <button
                        onClick={() => setIsRepliesVisible(!isRepliesVisible)}
                        className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 transition"
                    >
                        {isRepliesVisible ? "Hide Replies" : `View Replies (${totalCount})`}
                    </button>
                )}
            </div>

            {activeForm === "report" && (
                <div className="mt-4 p-4 rounded-lg shadow bg-red-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100">
                    <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
                        Report Comment
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
                        Submit Report
                    </button>
                </div>
            )}

            {activeForm === "reply" && (
                <div className="mt-4">
                    <CommentForm
                        value={replyContent}
                        onSubmit={handleReply}
                        onChange={setReplyContent}
                        placeholder="Write a reply..."
                    />
                </div>
            )}

            {isRepliesVisible && (
                <div className="mt-4 ml-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                    {repliesLoading ? (
                        <p className="text-gray-500 dark:text-gray-400">Loading replies...</p>
                    ) : (
                        <>
                            {replies?.map((reply) => (
                                <Comment key={reply.id} comment={reply}/>
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
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Comment;
