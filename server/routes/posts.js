// server/routes/posts.js

const express = require('express');
const { body } = require('express-validator');
const { 
  getPosts, 
  getPost, 
  createPost, 
  updatePost, 
  deletePost 
} = require('../controllers/postController');
const upload = require('../middleware/uploadMiddleware'); // <--- Import Multer
// const { protect } = require('../middleware/authMiddleware'); // (Enable this later if you want protection)

const router = express.Router();

// Validation rules
const postValidationRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('category').isMongoId().withMessage('Invalid Category ID'),
  // Note: We can't validate the file here easily with express-validator, handled in controller
];

router.route('/')
  .get(getPosts)
  // Add 'upload.single('featuredImage')' to handle the file upload
  .post(upload.single('featuredImage'), postValidationRules, createPost); 

router.route('/:id')
  .get(getPost)
  .put(upload.single('featuredImage'), postValidationRules, updatePost) // Allow updates too
  .delete(deletePost);

module.exports = router;