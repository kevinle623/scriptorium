import React, { useState } from "react";

interface TagInputProps {
    tags: string[];
    setTags: (tags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ tags, setTags }) => {
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
        <div className="flex flex-wrap items-center gap-2 border border-gray-300 p-2 rounded-lg">
            {tags.map((tag, index) => (
                <span
                    key={index}
                    className="bg-blue-500 text-white px-2 py-1 rounded-full flex items-center gap-1"
                >
                    {tag}
                    <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-white font-bold hover:text-gray-300"
                    >
                        &times;
                    </button>
                </span>
            ))}
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a tag and press Enter"
                className="flex-grow outline-none"
            />
        </div>
    );
};

export default TagInput;
