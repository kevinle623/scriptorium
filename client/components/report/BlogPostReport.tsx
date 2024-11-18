"use client";

import React, { useState } from "react";
import { useReportBlogPost } from "@client/hooks/useReportBlogPost";
import { ReportBlogPostRequest } from "@types/dtos/blogPosts";
import { useToaster } from "@client/providers/ToasterProvider";

interface BlogPostReportProps {
    blogPostId: string;
}

const BlogPostReport = ({ blogPostId }: BlogPostReportProps) => {
    const [reportReason, setReportReason] = useState("");
    const [showReportForm, setShowReportForm] = useState(false);
    const { mutate: reportBlogPost } = useReportBlogPost();
    const { setToaster } = useToaster();

    const handleReport = () => {
        if (!reportReason.trim()) {
            setToaster("Please provide a reason for reporting.", "info");
            return;
        }

        reportBlogPost(
            { id: blogPostId, reason: reportReason } as ReportBlogPostRequest,
            {
                onSuccess: () => {
                    setReportReason("");
                    setShowReportForm(false); // Hide the form after successful submission
                    setToaster("Report submitted successfully!", "success");
                },
                onError: (error) => {
                    const errorMessage =
                        error.response?.data?.error || "Failed to submit report. Please try again.";
                    setToaster(errorMessage, "error");
                    setShowReportForm(false)
                    console.error("Error reporting blog post:", errorMessage);
                },
            }
        );
    };

    return (
        <div className="mt-6">
            <button
                onClick={() => setShowReportForm(!showReportForm)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mb-2"
            >
                {showReportForm ? "Cancel Report" : "Report Blog Post"}
            </button>
            {showReportForm && (
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
                        Submit Report
                    </button>
                </div>
            )}
        </div>
    );
};

export default BlogPostReport;
