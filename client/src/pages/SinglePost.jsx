// client/src/pages/SinglePost.jsx

import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useFetchData from "../hooks/useFetchData";
import { postService, authService } from "../services/api"; // Import authService to check ownership

const SinglePost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const {
    data: post,
    loading,
    error,
  } = useFetchData(() => postService.getPost(slug), [slug]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await postService.deletePost(post._id);
        alert("Post deleted successfully");
        navigate("/");
      } catch (err) {
        alert("Failed to delete post");
      }
    }
  };

  // Helper for Image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath || imagePath === "default-post.jpg") return null;
    return `http://localhost:5000/${imagePath.replace(/\\/g, "/")}`;
  };

  if (loading)
    return (
      <div className="text-center py-20 text-xl text-gray-500">Loading...</div>
    );
  if (error)
    return (
      <div className="text-center py-20 text-xl text-red-500">
        Error: {error}
      </div>
    );
  if (!post)
    return <div className="text-center py-20 text-xl">Post not found</div>;

  const imageUrl = getImageUrl(post.featuredImage);
  // Check if current user is the author
  const isAuthor =
    currentUser && post.author && currentUser.id === post.author._id;

  return (
    <article className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden my-8">
      {/* Hero Image */}
      {imageUrl && (
        <div className="w-full h-96 relative">
          <img
            src={imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <span className="bg-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">
              {post.category?.name}
            </span>
            <h1 className="text-4xl font-extrabold text-white shadow-sm">
              {post.title}
            </h1>
          </div>
        </div>
      )}

      <div className="p-8 md:p-12">
        {/* Fallback Title if no image */}
        {!imageUrl && (
          <div className="border-b pb-6 mb-6">
            <span className="text-indigo-600 font-bold tracking-wide text-sm uppercase">
              {post.category?.name}
            </span>
            <h1 className="text-4xl font-extrabold text-gray-900 mt-2">
              {post.title}
            </h1>
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
              {post.author?.username?.[0]?.toUpperCase()}
            </div>
            <span className="font-medium text-gray-900">
              {post.author?.username}
            </span>
            <span>•</span>
            <span>
              {new Date(post.createdAt).toLocaleDateString(undefined, {
                dateStyle: "long",
              })}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span>👁️ {post.viewCount} views</span>
          </div>
        </div>

        {/* Content */}
        <div className="prose max-w-none text-gray-800 leading-relaxed text-lg whitespace-pre-wrap">
          {post.content}
        </div>

        {/* Action Buttons (Only visible to Author) */}
        {isAuthor && (
          <div className="mt-12 pt-6 border-t border-gray-100 flex justify-end space-x-4">
            <Link
              to={`/edit/${post._id}`}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              Edit Post
            </Link>
            <button
              onClick={handleDelete}
              className="px-6 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition"
            >
              Delete Post
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default SinglePost;
