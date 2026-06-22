import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const CommentSection = ({ blogId, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  // Fetch comments when the component mounts
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/comments/${blogId}`,
          {
            headers: {
              "x-auth-token": localStorage.getItem("userDetails")
                ? JSON.parse(localStorage.getItem("userDetails")).token
                : "",
            },
          }
        );

        if (response.status === 200) {
          const data = await response.json();
          setComments(data.comments);
        } else {
          toast.error("Failed to fetch comments.");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        toast.error("An error occurred while fetching comments.");
      }
    };

    fetchComments();
  }, [blogId]);

  // Handle adding a new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      return toast.error("Comment cannot be empty.");
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/comments/${blogId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("userDetails")
              ? JSON.parse(localStorage.getItem("userDetails")).token
              : "",
          },
          body: JSON.stringify({ text: newComment }),
        }
      );

      if (response.status === 201) {
        const data = await response.json();
        setComments((prev) => [data.comment, ...prev]); // Add the new comment to the top
        setNewComment("");
        toast.success("Comment added successfully!");
      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("An error occurred while adding the comment.");
    }
  };

  // Handle editing a comment
  const handleEditComment = async (commentId) => {
    if (!editingCommentText.trim()) {
      return toast.error("Comment cannot be empty.");
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("userDetails")
              ? JSON.parse(localStorage.getItem("userDetails")).token
              : "",
          },
          body: JSON.stringify({ text: editingCommentText }),
        }
      );

      if (response.status === 200) {
        const updatedComment = await response.json();
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === commentId ? updatedComment.comment : comment
          )
        );
        setEditingCommentId(null);
        setEditingCommentText("");
        toast.success("Comment updated successfully!");
      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (error) {
      console.error("Error editing comment:", error);
      toast.error("An error occurred while editing the comment.");
    }
  };

  // Handle deleting a comment
  const handleDeleteComment = (commentId) => {
    Swal.fire({
      title: "Delete Comment",
      text: "Are you sure you want to delete this comment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${import.meta.env.VITE_API_URL}/api/comments/${commentId}`, {
          method: "DELETE",
          headers: {
            "x-auth-token": localStorage.getItem("userDetails")
              ? JSON.parse(localStorage.getItem("userDetails")).token
              : "",
          },
        })
          .then((response) => {
            if (response.status === 200) {
              setComments((prev) => prev.filter((comment) => comment._id !== commentId));
              Swal.fire("Deleted!", "Your comment has been deleted.", "success");
            } else {
              Swal.fire("Error!", "Failed to delete the comment.", "error");
            }
          })
          .catch(() => {
            Swal.fire("Error!", "An error occurred. Please try again.", "error");
          });
      }
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Comments</h2>
        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment._id} className="comment">
              <img
                src={comment.author.profilePicture || "default-avatar.jpg"}
                alt={comment.author.username || "Anonymous"}
                className="author-avatar"
              />
              <div>
                <p>
                  <strong>{comment.author.username}</strong>
                </p>
                {editingCommentId === comment._id ? (
                  <textarea
                    value={editingCommentText}
                    onChange={(e) => setEditingCommentText(e.target.value)}
                  />
                ) : (
                  <p>{comment.text}</p>
                )}
              </div>
              {comment.author._id ===
                JSON.parse(localStorage.getItem("userDetails"))._id && (
                <div className="comment-actions">
                  {editingCommentId === comment._id ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleEditComment(comment._id)}
                    >
                      Save
                    </button>
                  ) : (
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="edit-icon"
                      onClick={() => {
                        setEditingCommentId(comment._id);
                        setEditingCommentText(comment.text);
                      }}
                    />
                  )}
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="delete-icon"
                    onClick={() => handleDeleteComment(comment._id)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className="modal-actions">
          <button className="btn" onClick={handleAddComment}>
            Add Comment
          </button>
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

CommentSection.propTypes = {
  blogId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CommentSection;
