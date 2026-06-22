const express = require("express");
const { getCommunities, createCommunity, upload } = require("../controllers/community.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const Community = require("../models/community.model");

const router = express.Router();

router.get("/", getCommunities); // Public route
router.post("/", authMiddleware, createCommunity); // Protected route

// Join a community
router.post("/join/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const community = await Community.findById(id);

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    if (!community.members) {
      community.members = [];
    }

    if (community.members.includes(userId)) {
      return res.status(400).json({ message: "You are already a member of this community" });
    }

    community.members.push(userId);
    await community.save();

    res.status(200).json({ message: "Successfully joined the community" });
  } catch (error) {
    console.error("Error joining community:", error);
    res.status(500).json({ message: "Failed to join community", error });
  }
});

// Update a community
router.put("/:id", authMiddleware, upload.single("profilePicture"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    let profilePicture = req.body.profilePicture;

    if (req.file) {
      profilePicture = req.file.filename;
    }

    const community = await Community.findById(id);

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    if (community.createdBy.toString() !== req.user._id) {
      return res.status(403).json({ message: "Unauthorized to update this community" });
    }

    community.title = title || community.title;
    community.description = description || community.description;
    community.profilePicture = profilePicture || community.profilePicture;

    await community.save();

    res.status(200).json({ message: "Community updated successfully", community });
  } catch (error) {
    console.error("Error updating community:", error);
    res.status(500).json({ message: "Failed to update community", error });
  }
});

// Delete a community
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const community = await Community.findById(id);

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    if (community.createdBy.toString() !== req.user._id) {
      return res.status(403).json({ message: "Unauthorized to delete this community" });
    }

    await community.deleteOne();

    res.status(200).json({ message: "Community deleted successfully" });
  } catch (error) {
    console.error("Error deleting community:", error);
    res.status(500).json({ message: "Failed to delete community", error });
  }
});

// Leave a community
router.post("/leave/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const community = await Community.findById(id);

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    if (!community.members || !community.members.includes(userId)) {
      return res.status(400).json({ message: "You are not a member of this community" });
    }

    community.members = community.members.filter((member) => member.toString() !== userId);
    await community.save();

    res.status(200).json({ message: "Successfully left the community" });
  } catch (error) {
    console.error("Error leaving community:", error);
    res.status(500).json({ message: "Failed to leave community", error });
  }
});

module.exports = router;