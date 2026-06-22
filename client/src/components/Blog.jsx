import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faComment } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { UserState } from "../context/UserContext";

const Blog = ({ blog, onClick, onDelete, onEdit, onComment , isMember }) => {
  const { user } = UserState();

  const isAuthorizedToComment =
    user &&
    (user._id === blog.author._id ||
      (blog.community && blog.community.createdBy === user._id) ||
      (blog.community && isMember));

  return (
    <div className="blog" onClick={onClick}>
      <img
        src={`${import.meta.env.VITE_API_URL}/uploads/covers/${blog.cover}`}
        alt={blog.title}
        className="blog-cover"
      />
      <div className="blog-content">
        <h2>{blog.title}</h2>
        <p className="summary">{blog.summary}</p>
        <div className="blog-details">
          <img
            src={blog.author.profilePicture || "default-avatar.jpg"}
            alt={blog.author.username || "Anonymous"}
            className="author-avatar"
          />
          <div className="blog-author">
            <h4>{blog.author.username}</h4>
            <p>{new Date(blog.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        {isAuthorizedToComment && (
          <div className="blog-actions">
            <FontAwesomeIcon
              icon={faComment}
              className="comment-icon"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the `onClick` for the blog
                onComment(blog);
              }}
            />
            {user._id === blog.author._id && (
              <>
                <FontAwesomeIcon
                  icon={faEdit}
                  className="edit-icon"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the `onClick` for the blog
                    onEdit(blog);
                  }}
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  className="delete-icon"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the `onClick` for the blog
                    onDelete(blog._id);
                  }}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onComment: PropTypes.func.isRequired,
  isMember: PropTypes.bool.isRequired,
};

export default Blog;