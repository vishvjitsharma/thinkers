import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

import Uploader from "./Uploader";

const BlogModal = ({ communityId, onClose, onBlogCreated, blog }) => {
  const [title, setTitle] = useState(blog?.title || "");
  const [summary, setSummary] = useState(blog?.summary || "");
  const [content, setContent] = useState(blog?.content || "");
  const [cover, setCover] = useState(blog?.cover || null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !summary || !content || !cover) {
      return toast.error("All fields are required!");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("summary", summary);
    formData.append("content", content);
    formData.append("cover", cover);
    formData.append("communityId", communityId);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/blog/${blog ? blog._id : "create"}`,
        {
          method: blog ? "PUT" : "POST",
          body: formData,
          headers: {
            "x-auth-token": localStorage.getItem("userDetails")
              ? JSON.parse(localStorage.getItem("userDetails")).token
              : "",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        const data = await response.json();
        toast.success(blog ? "Blog updated successfully!" : "Blog created successfully!");
        onBlogCreated(data.blog);
        onClose();
      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (error) {
      console.error("Error submitting blog:", error);
      toast.error("An error occurred while submitting the blog.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{blog ? "Edit Blog" : "Create Blog"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Blog Summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
          />
          <Uploader cover={cover} setCover={setCover} />
          <textarea
            placeholder="Description"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="15" // Increased rows for more space
            required
          />
          <div className="modal-actions">
            <button type="submit" className="btn">
              {blog ? "Update" : "Create"}
            </button>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

BlogModal.propTypes = {
  communityId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onBlogCreated: PropTypes.func.isRequired,
  blog: PropTypes.object,
};

export default BlogModal;