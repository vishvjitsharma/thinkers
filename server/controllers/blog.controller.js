const multer = require("multer");
const path = require("path");
const Blog = require("../models/blog.model");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/covers");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
  },
});

const upload = multer({ storage: storage });

const blogController = {
  getAllByCommunity: async (req, res) => {
    try {
      const { communityId } = req.params;
      console.log("Community ID:", communityId);
      console.log("Community ID received in API:", communityId);
      if (!communityId) {
        return res.status(400).json({ message: "Community ID is required" });
      }

      const blogs = await Blog.find({ community: communityId })
        .populate("author", "username profilePicture")
        .sort({ createdAt: -1 });

        console.log("Blogs fetched from database:", blogs);
      return res.status(200).json({ blogs });
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return res.status(500).json({ message: "Failed to fetch blogs", error });
    }
  },
  create: [
    upload.single("cover"),
    async (req, res) => {
      try {
        const { title, summary, content, communityId } = req.body;
        const cover = req.file.filename;
        const author = req.user._id;

        const blog = new Blog({
          title,
          summary,
          cover,
          content,
          author,
          community: communityId,
        });

        await blog.save();

        const populatedBlog = await Blog.findById(blog._id)
        .populate("author", "username profilePicture");

        return res.status(201).json({
          message: "Blog created successfully",
          blog: populatedBlog,
        });
      } catch (error) {
        console.error("Error creating blog:", error);
        return res.status(400).json({ message: error.message });
      }
    },
  ],
  update: [
    upload.single("cover"), // Use the redefined upload middleware
    async (req, res) => {
      try {
        const { id } = req.params;
        const { title, summary, content } = req.body;
        let cover = req.body.cover;

        if (req.file) {
          cover = req.file.filename;
        }

        const blog = await Blog.findById(id);

        if (!blog) {
          return res.status(404).json({ message: "Blog not found" });
        }

        if (blog.author.toString() !== req.user._id) {
          return res.status(403).json({ message: "Unauthorized to update this blog" });
        }

        blog.title = title || blog.title;
        blog.summary = summary || blog.summary;
        blog.cover = cover || blog.cover;
        blog.content = content || blog.content;

        await blog.save();

        return res.status(200).json({
          message: "Blog updated successfully",
          blog,
        });
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    },
  ],
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const blog = await Blog.findById(id);

      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      if (blog.author.toString() !== req.user._id) {
        return res.status(403).json({ message: "Unauthorized to delete this blog" });
      }

      await blog.deleteOne();

      return res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};

module.exports = blogController;