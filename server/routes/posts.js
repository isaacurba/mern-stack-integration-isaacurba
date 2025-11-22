const express = require('express');
const { body } = require('express-validator');

const { 
  getPosts, 
  getPost, 
  createPost, 
  updatePost, 
  deletePost 
} = require('../controllers/postController');
// const { protect } = require('../middleware/authMiddleware'); // For Task 5
    
const router = express.Router();

// Validation rules for post creation and update
const postValidationRules = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot be more than 100 characters'),
  body('content')
    .notEmpty()
    .withMessage('Content is required'),
  body('category')
    .isMongoId()
    .withMessage('Category ID is required and must be a valid ID'),
];

// Base path: /api/posts
router.route('/')
  .get(getPosts)
  // Temporarily unprotected. Will add protect middleware in Task 5.
  .post(postValidationRules, createPost); 

// Base path: /api/posts/:id
router.route('/:id')
  .get(getPost)
  // Temporarily unprotected.
  .put(postValidationRules, updatePost)
  // Temporarily unprotected.
  .delete(deletePost);

module.exports = router;