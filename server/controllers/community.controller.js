const multer = require("multer");
const path = require("path");

const Community = require("../models/community.model");

// Configure multer for file uploads
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

// Define the `getCommunities` function
const getCommunities = async (req, res) => {
  try {
    const communities = await Community.find().populate("createdBy", "username");
    res.status(200).json({ communities });
  } catch (error) {
    console.error("Error fetching communities:", error);
    res.status(500).json({ message: "Failed to fetch communities", error });
  }
};

const createCommunity = [
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const { title, description } = req.body;
      const profilePicture = req.file?.filename;

      if (!title || !description || !profilePicture) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const newCommunity = new Community({
        title,
        description,
        profilePicture,
        createdBy: req.user._id, // Use req.user._id from authMiddleware
      });

      await newCommunity.save();
      res.status(201).json({ community: newCommunity });
    } catch (error) {
      console.error("Error creating community:", error);
      res.status(500).json({ message: "Failed to create community", error });
    }
  },
];

module.exports = { getCommunities, createCommunity, upload};