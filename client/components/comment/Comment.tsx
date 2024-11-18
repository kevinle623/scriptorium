"use client";

import React, { useState } from "react";
import CommentForm from "./CommentForm";
import { Comment as CommentType } from "@types/dtos/comments";
import { useReportComment } from "@client/hooks/useReportComment";
import { useReplyComment } from "@client/hooks/useReplyComment";
import { useCommentReplies } from "@client/hooks/useCommentReplies";
import CommentVote from "@client/components/vote/CommentVote";
import { useToaster } from "@client/providers/ToasterProvider"

interface CommentProps {
    comment: CommentType;
}

const Comment = ({ comment }: CommentProps) => {
    const { mutate: reportComment } = useReportComment();
    const { mutate: replyToComment } = useReplyComment();
    const { replies, repliesLoading } = useCommentReplies(comment.id);
    const { setToaster } = useToaster();

    const [isRepliesVisible, setIsRepliesVisible] = useState(false);
    const [activeForm, setActiveForm] = useState<"reply" | "report" | null>(null); // Track the active form
    const [replyContent, setReplyContent] = useState("");
    const [reportReason, setReportReason] = useState("");

    const handleReply = () => {
        if (!replyContent.trim()) {
            setToaster("Please write a reply before submitting.", "info");
            return;
        }
        replyToComment(
            { id: comment.id, content: replyContent },
            {
                onSuccess: () => {
                    setReplyContent("");
                    setActiveForm(null);
                    setToaster("Reply submitted successfully!", "success");
                },
                onError: (error) => {
                    setToaster(error.response.data.error || "Failed to report comment. Please try again.", "error");
                    setActiveForm(null);
                    console.error(error);
                },
            }
        );
    };

    const handleReport = () => {
        if (!reportReason.trim()) {
            setToaster("Please provide a reason for reporting.", "info");
            return;
        }
        reportComment(
            { id: comment.id, reason: reportReason },
            {
                onSuccess: () => {
                    setReportReason("");
                    setActiveForm(null);
                    setToaster("Comment reported successfully.", "success");
                },
                onError: (error) => {
                    setToaster(error.response.data.error || "Failed to report comment. Please try again.", "error");
                    setActiveForm(null);
                    console.error(error);
                },
            }
        );
    };

    const toggleForm = (form: "reply" | "report") => {
        setActiveForm(activeForm === form ? null : form);
    };

    return (
        <div className="mb-4 p-4 rounded-lg shadow bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100">
            <div className="flex justify-between">
                <div>
                    <strong className="text-lg">User {comment.userId}</strong>
                    <p className="mt-2">{comment.content}</p>
                </div>
                <small className="text-gray-500 dark:text-gray-400 text-sm">
                    {new Date(comment.createdAt).toLocaleString()}
                </small>
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm">
                <CommentVote commentId={comment.id} />
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
                {replies && replies.length > 0 && (
                    <button
                        onClick={() => setIsRepliesVisible(!isRepliesVisible)}
                        className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 transition"
                    >
                        {isRepliesVisible ? "Hide Replies" : `View Replies (${replies.length})`}
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
                        replies.map((reply) => <Comment key={reply.id} comment={reply} />)
                    )}
                </div>
            )}
        </div>
    );
};

export default Comment;
