import React, {useState} from "react";
import {FaArrowDown, FaArrowUp} from "react-icons/fa";
import {useBlogPostVotes} from "@client/hooks/useBlogPostVotes";
import {useVoteBlogPost} from "@client/hooks/useVoteBlogPost";
import LoadingSpinner from "@client/components/loading/LoadingSpinner";
import {useJitOnboarding} from "@client/providers/JitOnboardingProvider";
import {VoteType} from "@/types/dtos/votes";

interface BlogPostVoteProps {
    blogPostId: number;
}

const BlogPostVote = ({ blogPostId }: BlogPostVoteProps) => {
    const { data, isLoading, isError, error } = useBlogPostVotes(blogPostId);
    const { mutate: voteBlogPost, isPending: isVoting } = useVoteBlogPost();
    const {triggerOnboarding} = useJitOnboarding()

    const [upVotes, setUpVotes] = useState<number>(0);
    const [downVotes, setDownVotes] = useState<number>(0);
    const [userVote, setUserVote] = useState<VoteType | null>(null);

    React.useEffect(() => {
        if (data) {
            setUpVotes(data.upVotes);
            setDownVotes(data.downVotes);
            setUserVote(data.userVote?.voteType || null);
        }
    }, [data]);

    const handleVote = (voteType: VoteType) => {
        const newVoteType = userVote === voteType ? null : voteType;

        triggerOnboarding(() => voteBlogPost(
            { blogPostId, voteType: newVoteType },
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
        ));
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isError) {
        return (
            <div className="text-red-500">
                Error fetching votes: {error.message}
            </div>
        );
    }

    return (
        <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
            <h2 className="text-xl font-bold mb-4">Votes</h2>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => handleVote(VoteType.UP)}
                    disabled={isVoting}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        userVote === "UP"
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                >
                    <FaArrowUp />
                    <span>{upVotes}</span>
                </button>

                <button
                    onClick={() => handleVote(VoteType.DOWN)}
                    disabled={isVoting}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        userVote === "DOWN"
                            ? "bg-red-500 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                >
                    <FaArrowDown />
                    <span>{downVotes}</span>
                </button>
            </div>
        </div>
    );
};

export default BlogPostVote;
