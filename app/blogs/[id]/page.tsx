import React, { useState } from "react";
import {
    useCommentBlogPost,
} from "@client/hooks/useCommentBlogPost";
import {useBlogPost} from "@client/hooks/useBlogPost";
import {useBlogPostComments} from "@client/hooks/useBlogPostComments";
import {useVoteBlogPost} from "@client/hooks/useVoteBlogPost";
import {useReportBlogPost} from "@client/hooks/useReportBlogPost";
import {useParams} from "next/navigation";
import {ToggleVoteRequest} from "@types/dtos/votes";
import {AddCommentRequest} from "@types/dtos/comments";
import {ReportBlogPostRequest} from "@types/dtos/blogPosts";

const BlogPost = () => {
    const userId = "temp"
    const params = useParams();
    const id = params?.id as string;

    const [newComment, setNewComment] = useState("");
    const [reportReason, setReportReason] = useState("");
    const [vote, setVote] = useState<"up" | "down" | undefined>();

    const { blogPost, blogLoading } = useBlogPost(id);
    const { comments, commentsLoading } = useBlogPostComments(id);

    const { mutate: voteBlogPost } = useVoteBlogPost();
    const { mutate: addComment } = useCommentBlogPost();
    const { mutate: reportBlogPost } = useReportBlogPost();

    const handleVote = (type: "up" | "down") => {
        const newVote = vote === type ? undefined : type;
        setVote(newVote);
        voteBlogPost({id, vote, userId} as ToggleVoteRequest);
    }

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        addComment({id, newComment, userId} as AddCommentRequest);
        setNewComment("");
    };

    const handleReport = () => {
        if (!reportReason.trim()) return alert("Please provide a reason for reporting.");
        reportBlogPost({id, reportReason, userId} as ReportBlogPostRequest);
        setReportReason("");
    };

    if (blogLoading || commentsLoading) {
        return <div className="text-center text-lg">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Blog Post Section */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-4">
                <h1 className="text-3xl font-bold mb-2">{blogPost?.title}</h1>
                <p className="text-gray-600 mb-4">{blogPost?.description}</p>
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Content:</h2>
                    <p className="text-gray-800">{blogPost?.content}</p>
                </div>
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Tags:</h2>
                    <p className="text-blue-600">{blogPost?.tags.join(", ")}</p>
                </div>
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={() => handleVote("up")}
                        className={`px-4 py-2 ${
                            vote === "up" ? "bg-green-600" : "bg-green-500"
                        } text-white rounded hover:bg-green-600`}
                    >
                        Upvote
                    </button>
                    <span className="text-gray-700">{blogPost?.upVotes}</span>
                    <button
                        onClick={() => handleVote("down")}
                        className={`px-4 py-2 ${
                            vote === "down" ? "bg-red-600" : "bg-red-500"
                        } text-white rounded hover:bg-red-600`}
                    >
                        Downvote
                    </button>
                    <span className="text-gray-700">{blogPost?.downVotes}</span>
                </div>
            </div>

            {/* Comments Section */}
            <div className="bg-gray-50 shadow-md rounded-lg p-6 mb-4">
                <h3 className="text-2xl font-bold mb-4">Comments</h3>
                {comments?.map((comment) => (
                    <div
                        key={comment.id}
                        className="mb-4 p-4 bg-white rounded-lg shadow"
                    >
                        <strong className="block text-gray-800">User {comment.userId}:</strong>
                        <p className="text-gray-700">{comment.content}</p>
                        <small className="text-gray-500">
                            {new Date(comment.createdAt).toLocaleString()}
                        </small>
                    </div>
                ))}
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
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
            <div className="bg-red-50 shadow-md rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-600 mb-2">Report Blog Post</h3>
                <textarea
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    rows={4}
                    className="w-full p-2 border border-red-300 rounded mb-4"
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
