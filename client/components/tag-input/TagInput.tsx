import React, { useState } from "react";

interface TagInputProps {
    tags: string[];
    setTags: (tags: string[]) => void;
}

const TagInput = ({ tags, setTags }: TagInputProps) => {
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue.trim()) {
            e.preventDefault();
            if (!tags.includes(inputValue.trim())) {
                setTags([...tags, inputValue.trim()]);
            }
            setInputValue("");
        }
    };

    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
    };

    return (
        <div className="flex items-center gap-2 flex-wrap border border-gray-300 p-2 rounded-lg">
            {tags.map((tag) => (
                <div
                    key={tag}
                    className="flex items-center bg-blue-500 text-white px-4 py-1 rounded-full"
                >
                    {tag}
                    <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-sm text-red-200 hover:text-red-500 appearance-none focus:outline-none"
                    >
                        ×
                    </button>

                </div>

            ))}
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a tag and press Enter"
                className="flex-grow border-none outline-none"
            />
        </div>
    );
};

export default TagInput;
