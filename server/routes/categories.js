const express = require("express");
const {
  getCategories,
  createCategory,
} = require("../controllers/categoryController");
const router = express.Router();

// The paths are relative to the '/api/categories' base route defined in server.js
router.route("/").get(getCategories);
router.route("/").post(createCategory);

module.exports = router;
