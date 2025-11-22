const Category = require('../models/Category');

class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (err) {
    next(err); 
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private 
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    let category = await Category.findOne({ name });
    if (category) {
      return next(new ApiError('Category already exists', 400));
    }

    category = await Category.create({ name, description });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(val => val.message);
      return next(new ApiError(message.join(', '), 400));
    }
    next(err);
  }
};