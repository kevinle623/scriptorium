"use client";

import React, { useState, useEffect } from "react";
import { useCodeTemplates } from "@client/hooks/useCodeTemplates";
import { CodeTemplate } from "@/types/dtos/codeTemplates";

interface CodeTemplateSelectorProps {
    selectedIds: number[];
    setSelectedIds: (newIds: number[]) => void;
}

const CodeTemplateSelector = ({
                                  selectedIds,
                                  setSelectedIds,
                              }: CodeTemplateSelectorProps) => {
    const [filters, setFilters] = useState({ page: 1, limit: 10, title: "" });
    const [searchInput, setSearchInput] = useState(""); // For immediate input updates
    const { data, isLoading } = useCodeTemplates(filters);

    // Debouncer: Update filters.title after 500ms of no input changes
    useEffect(() => {
        const handler = setTimeout(() => {
            setFilters((prev) => ({ ...prev, title: searchInput, page: 1 }));
        }, 500);

        // Cleanup the timeout if the user types again before 500ms
        return () => clearTimeout(handler);
    }, [searchInput]);

    const toggleSelection = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value); // Update the search input immediately
    };

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    return (
        <div className="border p-4 rounded-lg bg-white dark:bg-gray-800">
            <div className="mb-4">
                <label className="block mb-2 font-bold">Search Code Templates</label>
                <input
                    type="text"
                    placeholder="Search by title..."
                    className="w-full p-2 border rounded-lg"
                    onChange={handleSearch}
                    value={searchInput}
                />
            </div>

            {isLoading ? (
                <p>Loading code templates...</p>
            ) : (
                <div>
                    <table className="w-full border-collapse">
                        <thead>
                        <tr>
                            <th className="border-b p-2 text-left">Title</th>
                            <th className="border-b p-2 text-left">Language</th>
                            <th className="border-b p-2 text-left">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data?.codeTemplates.map((template: CodeTemplate) => (
                            <tr key={template.id} className="border-b">
                                <td className="p-2">{template.title}</td>
                                <td className="p-2">{template.language}</td>
                                <td className="p-2">
                                    <button
                                        type="button" // Prevents triggering form submission
                                        onClick={() => toggleSelection(template.id)}
                                        className={`px-3 py-1 rounded ${
                                            selectedIds.includes(template.id)
                                                ? "bg-red-500 text-white hover:bg-red-600"
                                                : "bg-green-500 text-white hover:bg-green-600"
                                        }`}
                                    >
                                        {selectedIds.includes(template.id)
                                            ? "Remove"
                                            : "Add"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {/* Pagination */}
                    <div className="mt-4 flex justify-end space-x-4">
                        <button
                            type="button" // Prevents triggering form submission
                            onClick={() => handlePageChange(filters.page - 1)}
                            disabled={filters.page === 1}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300"
                        >
                            Previous
                        </button>
                        <button
                            type="button" // Prevents triggering form submission
                            onClick={() => handlePageChange(filters.page + 1)}
                            disabled={
                                data && filters.page >= Math.ceil(data.totalCount / filters.limit)
                            }
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CodeTemplateSelector;
