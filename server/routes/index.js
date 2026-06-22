const express = require("express");
const router = express.Router();

const userRoutes = require("./user.routes");
const blogRoutes = require("./blog.routes");
const communityRoutes = require("./community.routes");
const commentRoutes = require("./comment.routes");

router.use("/auth", userRoutes);
router.use("/blog", blogRoutes);
router.use("/community", communityRoutes);
router.use("/comments", commentRoutes);

module.exports = router;
