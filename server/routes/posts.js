const express = require("express");
const { body } = require("express-validator");
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  addComment,
} = require("../controllers/postController");
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware"); // <--- 1. IMPORT THIS

const router = express.Router();

// Validation rules
const postValidationRules = [
  body("title").notEmpty().withMessage("Title is required"),
  body("content").notEmpty().withMessage("Content is required"),
  body("category").isMongoId().withMessage("Invalid Category ID"),
];

router
  .route("/")
  .get(getPosts)
  // 2. ADD 'protect' HERE before the upload middleware
  .post(
    protect,
    upload.single("featuredImage"),
    postValidationRules,
    createPost
  );

router
  .route("/:id")
  .get(getPost)
  // 3. ADD 'protect' HERE
  .put(protect, upload.single("featuredImage"), postValidationRules, updatePost)
  // 4. ADD 'protect' HERE
  .delete(protect, deletePost);

router.route("/:id/comments").post(protect, addComment);

module.exports = router;
