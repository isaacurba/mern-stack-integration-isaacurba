// client/src/pages/PostForm.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService, categoryService } from '../services/api';

const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    isPublished: true,
    featuredImage: null, // New state for the file
  });
  
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null); // To show image preview
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const cats = await categoryService.getAllCategories();
        setCategories(Array.isArray(cats) ? cats : cats.data || []);

        if (id) {
          const postResponse = await postService.getPost(id);
          const post = postResponse.data || postResponse;
          
          setFormData({
            title: post.title,
            content: post.content,
            excerpt: post.excerpt || '',
            category: post.category?._id || post.category || '',
            isPublished: post.isPublished,
            featuredImage: post.featuredImage, // Keep existing image string
          });
          // If there is an existing image, set it as preview
          if (post.featuredImage && !post.featuredImage.startsWith('default')) {
             // Note: You might need to fix the URL path depending on how you serve static files
             setPreview(`http://localhost:5000/${post.featuredImage.replace(/\\/g, '/')}`);
          }
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

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      setFormData({ ...formData, featuredImage: file });
      setPreview(URL.createObjectURL(file)); // Show preview of selected file
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Create FormData object (Required for file uploads)
    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('excerpt', formData.excerpt);
    data.append('category', formData.category);
    data.append('isPublished', formData.isPublished);
    
    // Only append image if it's a new file (not a string from DB)
    if (formData.featuredImage instanceof File) {
      data.append('featuredImage', formData.featuredImage);
    }

    try {
      if (id) {
        await postService.updatePost(id, data);
      } else {
        await postService.createPost(data);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !categories.length) return <div className="text-center p-10">Loading form...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 shadow-md rounded-lg border border-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {id ? '✏️ Edit Post' : '✍️ Create New Post'}
      </h1>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        
        {/* Image Upload Field */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Cover Image</label>
          
          {preview && (
            <div className="mb-3">
              <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-md border" />
            </div>
          )}
          
          <input 
            type="file" 
            name="featuredImage" 
            accept="image/*"
            onChange={handleChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Enter post title"
          />
        </div>

        {/* Category & Published */}
        <div className="flex gap-6">
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center pt-8">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-gray-700 font-medium">Publish Immediately</span>
            </label>
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Excerpt</label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            rows="2"
            placeholder="Brief summary..."
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            rows="10"
            placeholder="Write your masterpiece..."
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