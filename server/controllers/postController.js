const Post = require("../models/Post.js");
const Category = require("../models/Category.js");
const User = require("../models/User.js"); 
const { validationResult } = require("express-validator");

// Custom error class (re-defined here for clarity, but ideally in a separate utils file)
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// @desc    Get all posts (including pagination and filtering for Task 5)
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const query = { isPublished: true }; // Only show published posts by default
    if (req.query.category) {
      // Find category ID by name/slug
      const category = await Category.findOne({ slug: req.query.category });
      if (category) {
        query.category = category._id;
      }
    }

    // Total documents count for pagination metadata
    const total = await Post.countDocuments(query);

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex)
      .populate("category", "name slug") // Populate category details
      .populate("author", "username"); // Populate author details

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
    // Find by _id or slug
    let post = await Post.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
    })
      .populate("category", "name slug")
      .populate("author", "username")
      .populate("comments.user", "username");

    if (!post) {
      return next(new ApiError("Post not found", 404));
    }

    // Increment view count (using the method defined in Post.js)
    await post.incrementViewCount();

    res.status(200).json({ success: true, data: post });
  } catch (err) {
    // Check if the error is due to an invalid ObjectId format
    if (err.kind === "ObjectId") {
      return next(new ApiError("Invalid post ID", 400));
    }
    next(err);
  }
};

// @desc    Create a new blog post
// @route   POST /api/posts
// @access  Private (Requires Auth)
exports.createPost = async (req, res, next) => {
  // Check for validation errors from express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(errors.array()[0].msg, 400));
  }

  try {
    const { title, content, category, excerpt, tags } = req.body;

    // Find the actual Category ObjectId (assuming 'category' is the ID for now)
    const categoryId = await Category.findById(category);
    if (!categoryId) {
      return next(new ApiError("Invalid category ID", 400));
    }

    // Temporary: Since auth is not implemented, we manually set a dummy author for now.
    // Replace this with req.user.id when auth is ready (Task 5).
    const dummyUser = await User.findOne({});
    if (!dummyUser) {
      // Create a dummy user if none exist to satisfy the 'required' author field
      await User.create({
        username: "system_author",
        email: "system@blog.com",
      });
    }
    const authorId = req.user ? req.user.id : dummyUser._id;

    const post = await Post.create({
      title,
      content,
      category: categoryId,
      excerpt,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      author: authorId,
      isPublished: req.body.isPublished || false,
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
    // The slug is only updated if the title changes (handled by the pre-save hook)
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the updated document
      runValidators: true, // re-run schema validators
    });

    if (!post) {
      return next(new ApiError("Post not found", 404));
    }

    // Future check (Task 5): Ensure req.user.id matches post.author

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

    // Future check (Task 5): Ensure req.user.id matches post.author

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
