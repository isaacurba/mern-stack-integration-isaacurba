# 🚀 MERN Stack Blog Application

A full-stack blog application built with MongoDB, Express.js, React.js, and Node.js. This project demonstrates a complete CRUD workflow, user authentication, image uploads, and interactive features like comments and search.

## ✨ Features Implemented

* **Authentication & Security:**
    * User Registration and Login (JWT-based authentication).
    * Password hashing with bcrypt.
    * Protected routes (only logged-in users can write/edit/delete).
* **Blog Management (CRUD):**
    * **Create:** Write posts with a rich text content, category selection, and cover image upload.
    * **Read:** View paginated lists of posts and detailed single post views.
    * **Update:** Edit existing posts and update cover images.
    * **Delete:** Remove posts (Author only).
* **Advanced Features:**
    * 🖼️ **Image Uploads:** Local file storage using Multer.
    * 🔍 **Search & Pagination:** Filter posts by keyword and navigate through pages.
    * 💬 **Comments System:** Logged-in users can discuss posts.
    * 🏷️ **Categories:** Organize posts by topics.
* **UI/UX:**
    * Responsive design using Tailwind CSS.
    * Dynamic Navbar (changes based on login state).
    * Loading states and error handling.

## 🛠️ Tech Stack

* **Frontend:** React (Vite), Tailwind CSS, React Router DOM, Axios.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB (Mongoose ODM).
* **Utilities:** Multer (Uploads), JWT (Auth), BCrypt (Security).

---

## ⚙️ Setup & Installation Instructions

Follow these steps to run the project locally.

### 1. Prerequisites
* Node.js (v18+) installed.
* MongoDB installed locally or a MongoDB Atlas connection string.

### 2. Clone the Repository
```bash
git clone https://github.com/PLP-MERN-Stack-Development/mern-stack-integration-isaacurba
cd mern-blog