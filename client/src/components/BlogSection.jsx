import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import Blog from "./Blog";
import BlogModal from "./BlogModal";
import BlogDetails from "./BlogDetails";
import EditCommunityModal from "./EditCommunityModal";
import CommentSection from "./CommentSection";
import { UserState } from "../context/UserContext";
import { BlogState } from "../context/BlogContext";
import { CommunityState } from "../context/CommunityContext";

const BlogSection = ({ community, onCommunityDeleted }) => {
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false); // Track membership status
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);

  const { user } = UserState();
  const { blogs, fetchBlogs, setBlogs } = BlogState();
  const { setCommunities } = CommunityState();

  useEffect(() => {
    const loadBlogs = async () => {
      setLoading(true);
      await fetchBlogs(community._id);
      setLoading(false);
    };

    const checkMembership = () => {
      if (community.members && user) {
        setIsMember(community.members.includes(user._id));
      }
    };

    if (community && community._id) {
      loadBlogs();
      checkMembership();
    }
  }, [community, fetchBlogs, user]);

  useEffect(() => {
    if (community && community.members && user) {
      setIsMember(community.members.includes(user._id));
    }
  }, [community, user]);

  const handleJoinCommunity = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/community/join/${community._id}`,
        {
          method: "POST",
          headers: {
            "x-auth-token": localStorage.getItem("userDetails")
              ? JSON.parse(localStorage.getItem("userDetails")).token
              : "",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Joined community successfully!");
        setIsMember(true);
      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (error) {
      console.error("Error joining community:", error);
      toast.error("An error occurred while joining the community.");
    }
  };

  const handleLeaveCommunity = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/community/leave/${community._id}`,
        {
          method: "POST",
          headers: {
            "x-auth-token": localStorage.getItem("userDetails")
              ? JSON.parse(localStorage.getItem("userDetails")).token
              : "",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Left community successfully!");
        setIsMember(false);
      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (error) {
      console.error("Error leaving community:", error);
      toast.error("An error occurred while leaving the community.");
    }
  };

  const handleDeleteCommunity = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/community/${community._id}`,
        {
          method: "DELETE",
          headers: {
            "x-auth-token": localStorage.getItem("userDetails")
              ? JSON.parse(localStorage.getItem("userDetails")).token
              : "",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Community deleted successfully!");
        onCommunityDeleted(); // Notify parent component
      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (error) {
      console.error("Error deleting community:", error);
      toast.error("An error occurred while deleting the community.");
    }
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blog/${blogId}`, {
        method: "DELETE",
        headers: {
          "x-auth-token": localStorage.getItem("userDetails")
            ? JSON.parse(localStorage.getItem("userDetails")).token
            : "",
        },
      });

      if (response.status === 200) {
        toast.success("Blog deleted successfully!");
        setBlogs((prev) => prev.filter((blog) => blog._id !== blogId));
      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("An error occurred while deleting the blog.");
    }
  };

  const handleOpenCommentSection = (blog) => {
    setSelectedBlogId(blog._id);
    setIsCommentSectionOpen(true);
  };

  return (
    <section className="blog-section">
      <div className="community-details">
        <img
          src={`${import.meta.env.VITE_API_URL}/uploads/covers/${
            community.profilePicture
          }`}
          alt={community.title}
          className="community-pfp"
        />
        <h1>{community.title}</h1>
        {user && user._id === community.createdBy._id ? (
          <div className="community-actions">
            <button
              className="btn btn-primary"
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit
            </button>
            <button
              className="btn btn-outline btn-delete"
              onClick={handleDeleteCommunity}
            >
              Delete
            </button>
          </div>
        ) : !isMember ? (
          <button className="btn btn-primary" onClick={handleJoinCommunity}>
            Join Community
          </button>
        ) : (
          <button className="btn btn-outline" onClick={handleLeaveCommunity}>
            Leave Community
          </button>
        )}
      </div>

      {isEditModalOpen && (
        <EditCommunityModal
          community={community}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={(updatedCommunity) => {
            setCommunities((prev) =>
              prev.map((comm) =>
                comm._id === updatedCommunity._id ? updatedCommunity : comm
              )
            );
            Object.assign(community, updatedCommunity); // Update the reference
            setIsMember(
              updatedCommunity.members && updatedCommunity.members.includes(user._id)
            ); // Recalculate membership status
            setIsEditModalOpen(false); // Close the modal
          }}
        />
      )}

      <div className="blogs-container">
        {loading ? (
          <p>Loading blogs...</p>
        ) : blogs.length > 0 ? (
          blogs.map((blog) => (
            <Blog
              key={blog._id}
              blog={blog}
              onClick={() => setSelectedBlog(blog)}
              onDelete={() =>
                user &&
                (user._id === blog.author._id ||
                  user._id === community.createdBy._id)
                  ? handleDeleteBlog(blog._id)
                  : toast.error("You are not authorized to delete this blog.")
              }
              onEdit={() => {
                setEditingBlog(blog); // Set the blog to edit
                setIsBlogModalOpen(true); // Open the modal
              }}
              onComment={handleOpenCommentSection}
              isMember={isMember}
            />
          ))
        ) : (
          <p>No blogs are posted yet.</p>
        )}
      </div>

      {(isMember || user._id === community.createdBy._id) && (
        <button
          className="btn btn-primary create-blog-btn"
          onClick={() => {
            setEditingBlog(null); // Reset editingBlog state
            setIsBlogModalOpen(true); // Open the modal
          }}
        >
          Create Blog
        </button>
      )}

      {isBlogModalOpen && (
        <BlogModal
          communityId={community._id}
          blog={editingBlog}
          onClose={() => setIsBlogModalOpen(false)}
          onBlogCreated={(newBlog) => {
            setBlogs((prev) => {
              // If editing, replace the existing blog; otherwise, add the new blog
              const existingIndex = prev.findIndex(
                (blog) => blog._id === newBlog._id
              );
              if (existingIndex !== -1) {
                const updatedBlogs = [...prev];
                updatedBlogs[existingIndex] = newBlog;
                return updatedBlogs;
              }
              return [newBlog, ...prev];
            });
          }}
        />
      )}

      {selectedBlog && (
        <BlogDetails
          blog={selectedBlog}
          onClose={() => setSelectedBlog(null)}
        />
      )}

      {isCommentSectionOpen && (
        <CommentSection
          blogId={selectedBlogId}
          onClose={() => setIsCommentSectionOpen(false)}
        />
      )}
    </section>
  );
};

BlogSection.propTypes = {
  community: PropTypes.object.isRequired,
  onCommunityDeleted: PropTypes.func.isRequired,
};

export default BlogSection;