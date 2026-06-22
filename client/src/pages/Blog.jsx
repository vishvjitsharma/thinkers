import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import UserStore from "../stores/UserStore";

const Blog = () => {
  const [blog, setBlog] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state) {
    navigate("/");
  }

  const id = location.state.id;
  const { userDetails } = UserStore();

  useEffect(() => {
    const fetchBlog = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/blog/${id}`
      );

      if (response.status === 200) {
        const data = await response.json();
        setBlog(data.blog);
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    };

    fetchBlog();
  }, [id]);

  const handleDelete = (blogId) => {
    Swal.fire({
      title: "Delete Blog",
      text: "Are you sure you want to delete this blog?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${import.meta.env.VITE_API_URL}/api/blog/${blogId}`, {
          method: "DELETE",
          headers: {
            "x-auth-token": localStorage.getItem("userDetails")
              ? JSON.parse(localStorage.getItem("userDetails")).token
              : "",
          },
        })
          .then((response) => {
            if (response.status === 200) {
              Swal.fire("Deleted!", "Your blog has been deleted.", "success");
              navigate("/app");
            } else {
              Swal.fire("Error!", "Failed to delete the blog.", "error");
            }
          })
          .catch(() => {
            Swal.fire(
              "Error!",
              "An error occurred. Please try again.",
              "error"
            );
          });
      }
    });
  };

  return (
    blog &&
    blog.author && (
      <div className="container">
        <div className="blog-container">
          <div className="blog-header">
            <h1 className="blog-title">{blog.title}</h1>
            <div className="blog-controls">
              <div className="blog-author">
                <img
                  src={blog.author.profilePicture + blog.author.username}
                  alt="avatar"
                />
                <div className="blog-details">
                  <h4>{blog.author.username}</h4>
                  <p>
                    {new Date(blog.createdAt).getMonth() + 1}/
                    {new Date(blog.createdAt).getDate()}/
                    {new Date(blog.createdAt).getFullYear()}
                  </p>
                </div>
              </div>
              {blog.author &&
              userDetails &&
              blog.author._id === userDetails._id ? (
                <div className="blog-actions">
                  <Link
                    to="/edit"
                    state={{
                      id: blog._id,
                      title: blog.title,
                      summary: blog.summary,
                      content: blog.content,
                      cover: blog.cover,
                    }}
                  >
                    <FontAwesomeIcon icon={faEdit} className="edit-icon" />
                  </Link>
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="delete-icon"
                    onClick={handleDelete}
                  />
                </div>
              ) : null}
            </div>
          </div>
          <img
            src={`${import.meta.env.VITE_API_URL}/uploads/covers/${blog.cover}`}
            alt="article"
            className="blog-image"
          />
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </div>
    )
  );
};

export default Blog;
