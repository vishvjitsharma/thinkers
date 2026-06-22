const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      unique: true,
      trim: true,
    },
    summary: {
      type: String,
      required: [true, "Summary is required"],
      trim: true,
    },
    cover: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    author: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    community: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Community' 
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;