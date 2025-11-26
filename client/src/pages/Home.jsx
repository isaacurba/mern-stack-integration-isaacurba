// client/src/pages/Home.jsx

import React, { useState, useEffect } from 'react';
import { postService } from '../services/api';
import PostCard from '../components/PostCard';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search & Pagination State
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch posts whenever page or search changes
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // Pass page, limit(5), category(null), and search term
        const response = await postService.getAllPosts(page, 5, null, search);
        setPosts(response.data);
        setTotalPages(response.pages);
      } catch (err) {
        setError('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    // Debounce: Wait 500ms after typing stops before calling API
    const timeoutId = setTimeout(() => {
      fetchPosts();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [page, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to page 1 when searching
  };

  return (
    <div>
      {/* Search Bar Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Latest Articles</h1>
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={handleSearch}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="text-center py-20 text-xl text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : (
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-lg">No posts found matching "{search}"</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 space-x-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &larr; Previous
          </button>
          <span className="px-4 py-2 text-gray-700 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;