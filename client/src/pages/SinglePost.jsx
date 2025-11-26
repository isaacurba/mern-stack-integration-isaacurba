import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useFetchData from "../hooks/useFetchData";
import { postService, authService } from "../services/api";

const SinglePost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  
  // State for the new comment
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState("");

  // Fetch Post Data
  // Note: We use a key [slug, commentText] or similar to trigger re-fetch if needed, 
  // but for simplicity, we'll just manually update the UI or re-fetch after submit.
  const {
    data: post,
    loading,
    error,
  } = useFetchData(() => postService.getPost(slug), [slug]);

  // Handle Delete Post
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

  // Handle Submit Comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await postService.addComment(post._id, { content: commentText });
      setCommentText(""); // Clear form
      // Ideally, we re-fetch the post to see the new comment immediately
      // A simple page reload works for this assignment level, or efficient state update
      window.location.reload(); 
    } catch (err) {
      setCommentError("Failed to add comment. Please try again.");
    }
  };

// Helper for Image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath || imagePath === 'default-post.jpg') return null;
    
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const serverUrl = apiUrl.replace('/api', '');

    return `${serverUrl}/${imagePath.replace(/\\/g, "/")}`;
  };

  if (loading) return <div className="text-center py-20 text-xl text-gray-500">Loading...</div>;
  if (error) return <div className="text-center py-20 text-xl text-red-500">Error: {error}</div>;
  if (!post) return <div className="text-center py-20 text-xl">Post not found</div>;

  const imageUrl = getImageUrl(post.featuredImage);
  const isAuthor = currentUser && post.author && currentUser.id === post.author._id;

  return (
    <article className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden my-8">
      
      {/* Hero Image */}
      {imageUrl && (
        <div className="w-full h-96 relative">
          <img src={imageUrl} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 text-white">
             <span className="bg-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                {post.category?.name}
             </span>
             <h1 className="text-4xl font-extrabold text-white shadow-sm">{post.title}</h1>
          </div>
        </div>
      )}

      <div className="p-8 md:p-12">
        {/* Fallback Title */}
        {!imageUrl && (
          <div className="border-b pb-6 mb-6">
             <span className="text-indigo-600 font-bold tracking-wide text-sm uppercase">{post.category?.name}</span>
             <h1 className="text-4xl font-extrabold text-gray-900 mt-2">{post.title}</h1>
          </div>
        )}

        {/* Metadata & Content */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-8">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900">By {post.author?.username}</span>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="prose max-w-none text-gray-800 leading-relaxed text-lg whitespace-pre-wrap mb-10">
          {post.content}
        </div>

        {/* Author Actions */}
        {isAuthor && (
          <div className="flex justify-end space-x-4 mb-10 border-b pb-6">
            <Link to={`/edit/${post._id}`} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">Edit</Link>
            <button onClick={handleDelete} className="px-4 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100">Delete</button>
          </div>
        )}

        {/* --- COMMENTS SECTION --- */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Comments ({post.comments.length})</h3>

          {/* Comment List */}
          <div className="space-y-6 mb-8">
            {post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-indigo-600">{comment.user?.username || "User"}</span>
                    <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No comments yet. Be the first to share your thoughts!</p>
            )}
          </div>

          {/* Comment Form */}
          {currentUser ? (
            <form onSubmit={handleCommentSubmit}>
              {commentError && <p className="text-red-500 text-sm mb-2">{commentError}</p>}
              <textarea
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-3"
                rows="3"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
              />
              <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition">
                Post Comment
              </button>
            </form>
          ) : (
            <div className="text-center py-4 bg-gray-100 rounded-lg">
              <p className="text-gray-600">Please <Link to="/login" className="text-indigo-600 font-bold hover:underline">Login</Link> to leave a comment.</p>
            </div>
          )}
        </div>

      </div>
    </article>
  );
};

export default SinglePost;