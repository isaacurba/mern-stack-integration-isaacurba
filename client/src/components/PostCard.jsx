import React from "react";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  // Helper to construct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath || imagePath === "default-post.jpg") return null;
    // Replace backslashes (Windows) with forward slashes and prepend server URL
    return `http://localhost:5000/${imagePath.replace(/\\/g, "/")}`;
  };

  const imageUrl = getImageUrl(post.featuredImage);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-6 hover:shadow-lg transition-shadow duration-300">
      {/* Image Section */}
      {imageUrl && (
        <Link to={`/posts/${post.slug}`}>
          <div className="h-48 w-full overflow-hidden">
            <img
              src={imageUrl}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </Link>
      )}

      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 hover:text-indigo-600 transition-colors mb-2">
          <Link to={`/posts/${post.slug}`}>{post.title}</Link>
        </h2>

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span>By {post.author?.username || "Unknown"}</span>
          <span className="mx-2">•</span>
          <span className="bg-indigo-100 text-indigo-800 py-0.5 px-2 rounded-full text-xs font-medium">
            {post.category?.name || "Uncategorized"}
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt || post.content.substring(0, 120) + "..."}
        </p>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <Link
            to={`/posts/${post.slug}`}
            className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm flex items-center"
          >
            Read Article &rarr;
          </Link>
          <div className="flex space-x-4 text-xs text-gray-400">
            <span>👁️ {post.viewCount} Views</span>
            <span>💬 {post.comments?.length || 0} Comments</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
