const Post = require("../models/Post.js");
const Category = require("../models/Category.js");
const User = require("../models/User.js");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

// Custom error class
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// @desc    Get all posts (including pagination and filtering)
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const query = { isPublished: true }; // Only show published posts by default

    // Filter by category if provided
    if (req.query.category) {
      const category = await Category.findOne({ slug: req.query.category });
      if (category) {
        query.category = category._id;
      }
    }

    // Total documents count for pagination
    const total = await Post.countDocuments(query);

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex)
      .populate("category", "name slug")
      .populate("author", "username");

    res.status(200).json({
      success: true,
      count: posts.length,
      page,
      pages: Math.ceil(total / limit),
      data: posts,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get a single post by ID or slug
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    let query;

    // 1. Check if the parameter is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      // If it IS an ID, search by _id OR slug
      query = { $or: [{ _id: id }, { slug: id }] };
    } else {
      // If it is NOT an ID (it's a text slug), search ONLY by slug
      query = { slug: id };
    }

    let post = await Post.findOne(query)
      .populate("category", "name slug")
      .populate("author", "username")
      .populate("comments.user", "username");

    if (!post) {
      return next(new ApiError("Post not found", 404));
    }

    // Increment view count
    await post.incrementViewCount();

    res.status(200).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new blog post
// @route   POST /api/posts
// @access  Private (Requires Auth)
exports.createPost = async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(errors.array()[0].msg, 400));
  }

  try {
    const { title, content, category, excerpt, tags, isPublished } = req.body;

    const categoryId = await Category.findById(category);
    if (!categoryId) {
      return next(new ApiError("Invalid category ID", 400));
    }

    // --- Image Upload Logic ---
    let featuredImage = "default-post.jpg"; // Default fallback
    if (req.file) {
      // req.file is provided by the 'multer' middleware
      // We save the path relative to the server root
      featuredImage = req.file.path;
    }

    // --- User Logic ---
    // Check if a user exists (fallback for when Auth isn't fully active yet)
    let dummyUser = await User.findOne({});
    if (!dummyUser) {
      dummyUser = await User.create({
        username: "system_author",
        email: "system@blog.com",
        password: "password123", // Added password since User model requires it now
      });
    }

    // Use logged-in user ID if available (req.user), otherwise fallback
    const authorId = req.user ? req.user.id : dummyUser._id;

    const post = await Post.create({
      title,
      content,
      category: categoryId,
      excerpt,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      author: authorId,
      isPublished: isPublished !== undefined ? isPublished : false,
      featuredImage, // Save the image path
    });

    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

// @desc    Update an existing blog post
// @route   PUT /api/posts/:id
// @access  Private (Requires Auth)
exports.updatePost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(errors.array()[0].msg, 400));
  }

  try {
    const updateData = { ...req.body };

    // --- Image Update Logic ---
    // If a new file is uploaded, update the image field
    if (req.file) {
      updateData.featuredImage = req.file.path;
    }

    const post = await Post.findByIdAndUpdate(req.params.id, updateData, {
      new: true, // return the updated document
      runValidators: true, // re-run schema validators
    });

    if (!post) {
      return next(new ApiError("Post not found", 404));
    }

    res.status(200).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a blog post
// @route   DELETE /api/posts/:id
// @access  Private (Requires Auth)
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return next(new ApiError("Post not found", 404));
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
