"use client";

import { useState } from "react";
import { useBlogPosts } from "@client/hooks/useBlogPosts";
import { useRouter } from "next/navigation";
import LoadingSpinnerScreen from "@client/components/loading/LoadingSpinnerScreen";
import TagInput from "@client/components/tag-input/TagInput";
import { useJitOnboarding } from "@client/providers/JitOnboardingProvider";
import { useAuth } from "@client/providers/AuthProvider";

const BlogPosts = () => {
    const router = useRouter();
    const { triggerOnboarding } = useJitOnboarding();
    const { isAuthed } = useAuth(); // Access isAuthed from useAuth()

    const [filters, setFilters] = useState({
        title: "",
        content: "",
        tags: [] as string[],
        orderBy: undefined,
        page: 1,
        limit: 10,
        mineOnly: false, // Add mineOnly to the filters
    });

    const [searchFilters, setSearchFilters] = useState(filters);

    const { data = [], isLoading, error } = useBlogPosts({
        ...searchFilters,
        title: searchFilters.title || undefined,
        content: searchFilters.content || undefined,
        tags: searchFilters.tags && searchFilters.tags.length > 0 ? searchFilters.tags.join(",") : undefined,
    });

    const { blogPosts = [], totalCount = 0 } = data;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const handleSearch = () => {
        setSearchFilters({ ...filters, page: 1 });
    };

    const handleReset = () => {
        const defaultFilters = {
            title: "",
            content: "",
            tags: [] as string[], // Reset tags as empty list
            orderBy: undefined,
            page: 1,
            limit: 10,
            mineOnly: false, // Reset mineOnly to false
        };
        setFilters(defaultFilters);
        setSearchFilters(defaultFilters);
    };

    const handlePagination = (direction: "next" | "prev") => {
        const newPage = direction === "next" ? searchFilters.page + 1 : searchFilters.page - 1;
        setSearchFilters({ ...searchFilters, page: newPage });
    };

    const toggleMineOnly = () => {
        setFilters((prevFilters) => ({ ...prevFilters, mineOnly: !prevFilters.mineOnly }));
        setSearchFilters((prevFilters) => ({ ...prevFilters, mineOnly: !prevFilters.mineOnly }));
    };

    const totalPages = Math.ceil(totalCount / searchFilters.limit);

    if (isLoading) return <LoadingSpinnerScreen />;
    if (error) return <div>Error fetching blog posts!</div>;

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Blog Posts</h1>
                <button
                    onClick={() => triggerOnboarding(() => router.push("/blogs/create"))}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                    Create New Post
                </button>
            </div>

            {/* Filter Section */}
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
                <TagInput
                    tags={filters.tags}
                    setTags={(newTags) => setFilters((prevFilters) => ({ ...prevFilters, tags: newTags }))}
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
                {isAuthed && (
                    <div className="flex items-center gap-2">
                        <label htmlFor="mineOnly" className="text-gray-700">
                            Show My Posts
                        </label>
                        <input
                            type="checkbox"
                            id="mineOnly"
                            checked={filters.mineOnly}
                            onChange={toggleMineOnly}
                            className="form-checkbox text-blue-500 h-5 w-5"
                        />
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Search
                </button>
                <button
                    onClick={handleReset}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                    Reset Filters
                </button>
            </div>

            {/* Blog Posts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {blogPosts.map((post) => (
                    <div
                        key={post.id}
                        className="border border-gray-300 dark:border-gray-700 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => router.push(`/blogs/${post.id}`)} // Navigate to /blogs/{blog.id}
                    >
                        <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">
                            {post.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">{post.description}</p>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Tags: {post.tags?.join(", ")}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
                <button
                    disabled={searchFilters.page === 1}
                    onClick={() => handlePagination("prev")}
                    className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                    Previous
                </button>
                <div>
                    Page {searchFilters.page} of {totalPages || 1}
                </div>
                <button
                    disabled={searchFilters.page >= totalPages}
                    onClick={() => handlePagination("next")}
                    className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default BlogPosts;
