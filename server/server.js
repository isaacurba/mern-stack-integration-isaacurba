const express = require("express");
const connectedDB = require("./config/db.js");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Import routes
const postRoutes = require("./routes/posts.js");
const categoryRoutes = require("./routes/categories.js");
const authRoutes = require('./routes/auth'); // <--- UNCOMMENTED THIS

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (Important for the images you just implemented)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Log requests in development mode
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// API routes
app.use("/api/posts", postRoutes);
app.use("/api/categories", categoryRoutes);
app.use('/api/auth', authRoutes); // <--- UNCOMMENTED THIS

// Root route
app.get("/", (req, res) => {
  res.send("MERN Blog API is running");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Server Error",
  });
});

app.listen(PORT, () => {
  connectedDB().then(() => {
    console.log(`App listening on port http://localhost:${PORT}!`);
  });
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  // Close server & exit process
  process.exit(1);
});

module.exports = app;