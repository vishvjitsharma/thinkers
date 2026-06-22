const Comment = require("../models/comment.model");
const Blog = require("../models/blog.model");

const commentController = {
  // Fetch all comments for a specific blog
  getComments: async (req, res) => {
    try {
      const { blogId } = req.params;

      // Check if the blog exists
      const blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      // Fetch comments for the blog
      const comments = await Comment.find({ blog: blogId })
        .populate("author", "username profilePicture")
        .sort({ createdAt: -1 }); // Sort by newest first

      res.status(200).json({ comments });
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  },

  // Add a comment to a specific blog
  addComment: async (req, res) => {
    try {
      const { blogId } = req.params;
      const { text } = req.body;

      // Check if the blog exists
      const blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      // Create a new comment
      const comment = new Comment({
        text,
        author: req.user._id, // User ID from the auth middleware
        blog: blogId,
      });

      await comment.save();

      // Populate the author field for the response
      const populatedComment = await Comment.findById(comment._id).populate(
        "author",
        "username profilePicture"
      );

      res.status(201).json({ comment: populatedComment });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ message: "Failed to add comment" });
    }
  },

  editComment: async (req, res) => {
    try {
      const { id } = req.params;
      const { text } = req.body;

      const comment = await Comment.findById(id);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      if (comment.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Unauthorized to edit this comment" });
      }

      comment.text = text;
      await comment.save();

      res.status(200).json({ comment, message: "Comment updated successfully" });
    } catch (error) {
      console.error("Error editing comment:", error);
      res.status(500).json({ message: "Failed to edit comment" });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const { id } = req.params;

      const comment = await Comment.findById(id);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      if (comment.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Unauthorized to delete this comment" });
      }

      // Delete the comment
      await comment.deleteOne();
      return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Failed to delete comment" });
    }
  },
};

module.exports = commentController;