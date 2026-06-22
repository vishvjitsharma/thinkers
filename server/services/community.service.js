const Community = require("../models/community.model");

const communityServices = {
  create: async (title, description, profilePicture, createdBy) => {
    const existingCommunity = await Community.findOne({ title });

    if (existingCommunity) {
      throw new Error("Community with this title already exists");
    }

    const community = new Community({
      title,
      description,
      profilePicture,
      createdBy,
    });

    return await community.save();
  },
  getAll: async () => {
    return await Community.find().populate("createdBy", "username");
  },
  getById: async (id) => {
    return await Community.findById(id).populate("createdBy", "username");
  },
  update: async (id, title, description, profilePicture, userId) => {
    const community = await Community.findById(id);

    if (!community) {
      throw new Error("Community not found");
    }

    if (community.createdBy.toString() !== userId) {
      throw new Error("Unauthorized to update this community");
    }

    community.title = title || community.title;
    community.description = description || community.description;
    community.profilePicture = profilePicture || community.profilePicture;

    return await community.save();
  },
  delete: async (id, userId) => {
    const community = await Community.findById(id);

    if (!community) {
      throw new Error("Community not found");
    }

    if (community.createdBy.toString() !== userId) {
      throw new Error("Unauthorized to delete this community");
    }

    return await community.remove();
  },
};

module.exports = communityServices;