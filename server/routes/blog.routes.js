const express = require("express");

const blogController = require("../controllers/blog.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const blogRouter = express.Router();

blogRouter.get("/community/:communityId", blogController.getAllByCommunity); // Fetch blogs by community
blogRouter.post("/create", authMiddleware, blogController.create); // Create a blog
blogRouter.put("/:id", authMiddleware, blogController.update); // Update a blog
blogRouter.delete("/:id", authMiddleware, blogController.delete); // Delete a blog

module.exports = blogRouter;