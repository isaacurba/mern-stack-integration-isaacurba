const express = require("express");
const { body } = require("express-validator");
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");

// IMPORT THE MISSING MIDDLEWARE
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const postValidationRules = [
  body("title").notEmpty().withMessage("Title is required"),
  body("content").notEmpty().withMessage("Content is required"),
  body("category").isMongoId().withMessage("Invalid Category ID"),
];

router
  .route("/")
  .get(getPosts)
  // ADD protect AND upload middleware here
  .post(
    protect,
    upload.single("featuredImage"),
    postValidationRules,
    createPost
  );

router
  .route("/:id")
  .get(getPost)
  // ADD protect AND upload middleware here
  .put(protect, upload.single("featuredImage"), postValidationRules, updatePost)
  // ADD protect middleware here
  .delete(protect, deletePost);

module.exports = router;
