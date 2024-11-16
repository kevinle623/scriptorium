import { BlogPost } from "@/types/dtos/blogPosts"

interface BlogPostCardProps {
    post: BlogPost;
}

const BlogPostCard = ({ post }: BlogPostCardProps) => {
    return (
        <div className="border rounded-lg p-4">
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-gray-500">{post.description}</p>
            <span className="text-sm text-gray-400">
        Created at: {new Date(post.createdAt).toLocaleDateString()}
      </span>
        </div>
    );
};

export default BlogPostCard