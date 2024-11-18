"use client";

import { useState } from "react";
import { useCodeTemplates } from "@client/hooks/useCodeTemplates";
import { useRouter } from "next/navigation";
import { useAuth } from "@client/providers/AuthProvider";
import LoadingSpinnerScreen from "@client/components/loading/LoadingSpinnerScreen";
import TagInput from "@client/components/tag-input/TagInput";

const CodeTemplates = () => {
    const router = useRouter();
    const { isAuthed } = useAuth();

    const [filters, setFilters] = useState({
        title: "",
        content: "",
        tags: [] as string[],
        page: 1,
        limit: 10,
        mineOnly: false,
    });

    const [searchFilters, setSearchFilters] = useState(filters);

    const { data = {}, isLoading, error } = useCodeTemplates({
        ...searchFilters,
        tags: searchFilters.tags && searchFilters.tags.length > 0 ? searchFilters.tags.join(",") : undefined,
    });
    const { codeTemplates = [], totalCount = 0 } = data;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };

    const handleSearch = () => {
        setSearchFilters({ ...filters, page: 1 });
    };

    const handleReset = () => {
        const defaultFilters = {
            title: "",
            content: "",
            tags: [] as string[],
            page: 1,
            limit: 10,
            mineOnly: false,
        };
        setFilters(defaultFilters);
        setSearchFilters(defaultFilters);
    };

    const handlePagination = (direction: "next" | "prev") => {
        const newPage = direction === "next" ? searchFilters.page + 1 : searchFilters.page - 1;
        setSearchFilters({ ...searchFilters, page: newPage });
    };

    const toggleMineOnly = () => {
        setFilters((prev) => ({ ...prev, mineOnly: !prev.mineOnly }));
        setSearchFilters((prev) => ({ ...prev, mineOnly: !prev.mineOnly }));
    };

    const totalPages = Math.ceil(totalCount / searchFilters.limit);

    if (isLoading) return <LoadingSpinnerScreen />;
    if (error) return <div>Error fetching code templates!</div>;

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Code Templates</h1>
                <button
                    onClick={() => router.push("/playground")}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                    Create New Template
                </button>
            </div>

            {/* Filters Section */}
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
                    setTags={(newTags) => setFilters({ ...filters, tags: newTags })}
                />
                {isAuthed && (
                    <div className="flex items-center gap-2">
                        <label htmlFor="mineOnly" className="text-gray-700">
                            Show My Templates
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

            {/* Code Templates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {codeTemplates.map((template) => (
                    <div
                        key={template.id}
                        onClick={() => router.push(`/code-templates/${template.id}`)}
                        className="cursor-pointer border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    >
                        <h2 className="text-xl font-bold mb-2">{template.title}</h2>
                        <p className="text-gray-600 mb-2">{template.content}</p>
                        <div className="text-sm text-gray-500">
                            Tags: {template.tags?.join(", ")}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
                <button
                    disabled={searchFilters.page === 1}
                    onClick={() => handlePagination("prev")}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                >
                    Previous
                </button>
                <div>
                    Page {searchFilters.page} of {totalPages || 1}
                </div>
                <button
                    disabled={searchFilters.page >= totalPages}
                    onClick={() => handlePagination("next")}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default CodeTemplates;
