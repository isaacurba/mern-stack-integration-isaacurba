import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService, categoryService } from '../services/api';

const PostForm = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  // --- 1. Form State Management ---
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '', // Stores the selected category ID
  });
  
  const [categories, setCategories] = useState([]); // To populate the dropdown
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- 2. Load Data (Categories & Existing Post) ---
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch all categories for the dropdown
        const cats = await categoryService.getAllCategories();
        setCategories(cats);

        // If we are editing, fetch the existing post data
        if (id) {
          const post = await postService.getPost(id);
          setFormData({
            title: post.title,
            content: post.content,
            excerpt: post.excerpt || '',
            category: post.category._id, // Ensure we set the ID, not the object
          });
        }
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // --- 3. Handle Input Changes ---
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // --- 4. Handle Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true);
    setError(null);

    try {
      if (id) {
        // Update existing post
        await postService.updatePost(id, formData);
      } else {
        // Create new post
        await postService.createPost(formData);
      }
      // Redirect to Home Page on success
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !categories.length) return <div className="text-center p-10">Loading form...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {id ? '✏️ Edit Post' : '✍️ Create New Post'}
      </h1>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Title Input */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter post title"
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Excerpt Input */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Excerpt (Short Summary)</label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="2"
            placeholder="Brief description..."
          />
        </div>

        {/* Content Input */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="10"
            placeholder="Write your post content here..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white font-bold py-3 rounded hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-300"
        >
          {loading ? 'Saving...' : (id ? 'Update Post' : 'Publish Post')}
        </button>
      </form>
    </div>
  );
};

export default PostForm;