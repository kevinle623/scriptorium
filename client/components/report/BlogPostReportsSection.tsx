import React, {useState} from "react";
import {useBlogPostReports} from "@client/hooks/blogs/useBlogPostReports";
import ReportItem from "@client/components/report/ReportItem";
import LoadingSpinner from "@client/components/loading/LoadingSpinner";

interface BlogPostReportsSectionProps {
    blogPostId: number;
}

const BlogPostReportsSection = ({blogPostId}: BlogPostReportsSectionProps) => {
    const [page, setPage] = useState(1);
    const limit = 10;

    const {blogPostReports, blogPostReportsLoading} = useBlogPostReports(blogPostId, page, limit);

    if (blogPostReportsLoading) {
        return (
            <LoadingSpinner/>
        );
    }

    const handleNextPage = () => setPage((prev) => prev + 1);
    const handlePreviousPage = () => setPage((prev) => Math.max(1, prev - 1));

    return (
        <div className="p-6 mb-4 rounded-lg shadow-md bg-gray-50 dark:bg-gray-800">
            <h3 className="text-2xl font-bold mb-4">Reports</h3>
            {blogPostReports?.reports?.length ? (
                <ul className="space-y-4">
                    {blogPostReports.reports.map((report) => (
                        <ReportItem key={report.id} report={report}/>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-800 dark:text-gray-100">No reports found.</p>
            )}

            <div className="flex justify-between mt-4">
                <button
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={handleNextPage}
                    disabled={page * limit >= (blogPostReports?.totalCount || 0)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    )
        ;
};

export default BlogPostReportsSection;
