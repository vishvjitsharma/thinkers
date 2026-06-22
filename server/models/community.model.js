const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const communitySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Community title is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Community description is required"],
    },
    profilePicture: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Community = mongoose.model("Community", communitySchema);

module.exports = Community;