import React, { useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useCommentVotes } from "@client/hooks/useCommentVotes";
import { useVoteComment } from "@client/hooks/useVoteComment";

interface CommentVoteProps {
    commentId: number;
}

const CommentVote = ({ commentId }: CommentVoteProps) => {
    const { data, isLoading, isError, error } = useCommentVotes(commentId);
    const { mutate: voteComment, isLoading: isVoting } = useVoteComment();

    const [upVotes, setUpVotes] = useState<number>(0);
    const [downVotes, setDownVotes] = useState<number>(0);
    const [userVote, setUserVote] = useState<"UP" | "DOWN" | null>(null);

    React.useEffect(() => {
        if (data) {
            setUpVotes(data.upVotes);
            setDownVotes(data.downVotes);
            setUserVote(data.userVote?.voteType || null);
        }
    }, [data]);

    const handleVote = (voteType: "UP" | "DOWN") => {
        const newVoteType = userVote === voteType ? null : voteType;

        voteComment(
            { commentId, voteType: newVoteType },
            {
                onSuccess: () => {
                    if (newVoteType === "UP") {
                        setUpVotes(upVotes + 1);
                        if (userVote === "DOWN") setDownVotes(downVotes - 1);
                    } else if (newVoteType === "DOWN") {
                        setDownVotes(downVotes + 1);
                        if (userVote === "UP") setUpVotes(upVotes - 1);
                    } else if (newVoteType === null) {
                        if (userVote === "UP") setUpVotes(upVotes - 1);
                        if (userVote === "DOWN") setDownVotes(downVotes - 1);
                    }
                    setUserVote(newVoteType);
                },
                onError: (err) => {
                    console.error("Failed to cast vote:", err.message);
                },
            }
        );
    };

    if (isLoading) return null; // Avoid showing spinner here for a smaller component

    if (isError) {
        console.error("Error fetching votes:", error.message);
        return null;
    }

    return (
        <div className="flex items-center gap-2 text-sm">
            <button
                onClick={() => handleVote("UP")}
                disabled={isVoting}
                className={`flex items-center gap-1 px-3 py-1 rounded ${
                    userVote === "UP"
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
            >
                <FaArrowUp />
                <span>{upVotes}</span>
            </button>

            <button
                onClick={() => handleVote("DOWN")}
                disabled={isVoting}
                className={`flex items-center gap-1 px-3 py-1 rounded ${
                    userVote === "DOWN"
                        ? "bg-red-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
            >
                <FaArrowDown />
                <span>{downVotes}</span>
            </button>
        </div>
    );
};

export default CommentVote;
