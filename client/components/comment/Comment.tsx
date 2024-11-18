import React, { useState } from "react";
import CommentForm from "./CommentForm";
import { Comment as CommentType } from "@types/dtos/comments";
import { useReportComment } from "@client/hooks/useReportComment";
import { useCommentReplies } from "@client/hooks/useCommentReplies";
import CommentVote from "@client/components/vote/CommentVote";

interface CommentProps {
    comment: CommentType;
}

const Comment = ({ comment }: CommentProps) => {
    const { mutate: reportComment } = useReportComment();
    const { replies, repliesLoading } = useCommentReplies(comment.id);

    const [isRepliesVisible, setIsRepliesVisible] = useState(false);
    const [isReplyFormVisible, setIsReplyFormVisible] = useState(false);
    const [replyContent, setReplyContent] = useState("");

    const handleReport = () => {
        reportComment({ commentId: comment.id });
    };

    const handleReply = (content: string) => {
        console.log("Reply to Comment:", content);
        setReplyContent(""); // Clear the input field after submission
        setIsReplyFormVisible(false); // Hide the reply form after submitting
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
                    onClick={handleReport}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                >
                    Report
                </button>
                <button
                    onClick={() => setIsReplyFormVisible(!isReplyFormVisible)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                    {isReplyFormVisible ? "Cancel Reply" : "Reply"}
                </button>
                {replies && replies.length > 0 && (
                    <button
                        onClick={() => setIsRepliesVisible(!isRepliesVisible)}
                        className="px-2 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 transition"
                    >
                        {isRepliesVisible ? "Hide Replies" : `View Replies (${replies.length})`}
                    </button>
                )}
            </div>

            {isRepliesVisible && (
                <div className="mt-4 ml-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                    {repliesLoading ? (
                        <p className="text-gray-500 dark:text-gray-400">Loading replies...</p>
                    ) : (
                        replies.map((reply) => <Comment key={reply.id} comment={reply} />)
                    )}
                </div>
            )}

            {isReplyFormVisible && (
                <div className="mt-4">
                    <CommentForm
                        value={replyContent}
                        onSubmit={handleReply}
                        onChange={setReplyContent}
                        placeholder="Write a reply..."
                    />
                </div>
            )}
        </div>
    );
};

export default Comment;
