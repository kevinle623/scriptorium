"use client";

import { useState } from "react";
import { useBlogPosts } from "@client/hooks/useBlogPosts";
import { useRouter } from "next/navigation";

const BlogPosts = () => {
    const router = useRouter(); // Next.js router

    const [filters, setFilters] = useState({
        title: "",
        content: "",
        tags: "",
        orderBy: "",
        page: 1,
        limit: 10,
    });

    const { data = [], isLoading, error } = useBlogPosts(filters);

    const { blogPosts = [], totalCount = 0 } = data;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const handleSearch = () => {
        setFilters((prev) => ({ ...prev, page: 1 }));
    };

    const totalPages = Math.ceil(totalCount / filters.limit);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching blog posts!</div>;

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Blog Posts</h1>
                {/* Create New Post Button */}
                <button
                    onClick={() => router.push("/blogs/create")}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                    Create New Post
                </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <input
                    type="text"
                    name="title"
                    placeholder="Search by Title"
                    value={filters.title}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-lg"
                />
                <input
                    type="text"
                    name="content"
                    placeholder="Search by Content"
                    value={filters.content}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-lg"
                />
                <input
                    type="text"
                    name="tags"
                    placeholder="Filter by Tags (comma-separated)"
                    value={filters.tags}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-lg"
                />
                <select
                    name="orderBy"
                    value={filters.orderBy}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-lg"
                >
                    <option value="">Sort By</option>
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                    <option value="mostReported">Most Reported</option>
                </select>
            </div>
            <button
                onClick={handleSearch}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
                Search
            </button>

            {/* Blog Posts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {blogPosts.map((post) => (
                    <div
                        key={post.id}
                        className="border border-gray-300 p-4 rounded-lg shadow-md"
                    >
                        <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                        <p className="text-gray-600 mb-2">{post.description}</p>
                        <div className="text-sm text-gray-500">
                            Tags: {post.tags?.join(", ")}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
                <button
                    disabled={filters.page === 1}
                    onClick={() =>
                        setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
                    }
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                >
                    Previous
                </button>
                <div>
                    Page {filters.page} of {totalPages || 1}
                </div>
                <button
                    disabled={filters.page >= totalPages}
                    onClick={() =>
                        setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                    }
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default BlogPosts;
