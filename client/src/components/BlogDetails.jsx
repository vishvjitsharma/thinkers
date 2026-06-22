import PropTypes from "prop-types";
import "../styles/blogDetailsStyles.css";

const BlogDetails = ({ blog, onClose }) => {
  return (
    <div className="blog-details-overlay">
      <div className="blog-details-container">
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
        <h1 className="blog-title">{blog.title}</h1>
        <img
          src={`${import.meta.env.VITE_API_URL}/uploads/covers/${blog.cover}`}
          alt={blog.title}
          className="blog-cover"
        />
        <p className="blog-summary">{blog.summary}</p>
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
        <div className="blog-author">
          <img
            src={blog.author.profilePicture || "default-avatar.jpg"}
            alt={blog.author.username || "Anonymous"}
            className="author-avatar"
          />
          <p>Written by: {blog.author.username}</p>
          <p>Date: {new Date(blog.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

BlogDetails.propTypes = {
  blog: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default BlogDetails;