const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const commentController = require("../controllers/comment.controller");

const router = express.Router();

// Fetch comments for a blog
router.get("/:blogId", authMiddleware, commentController.getComments);

// Add a comment to a blog
router.post("/:blogId", authMiddleware, commentController.addComment);

// Edit a comment
router.put("/:id", authMiddleware, commentController.editComment);

// Delete a comment
router.delete("/:id", authMiddleware, commentController.deleteComment);

module.exports = router;