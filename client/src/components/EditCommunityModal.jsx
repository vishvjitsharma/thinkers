import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import Uploader from "./Uploader";

const EditCommunityModal = ({ community, onClose, onUpdate }) => {
  const [title, setTitle] = useState(community.title);
  const [description, setDescription] = useState(community.description);
  const [profilePicture, setProfilePicture] = useState(community.profilePicture);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (profilePicture instanceof File) {
      formData.append("profilePicture", profilePicture);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/community/${community._id}`,
        {
          method: "PUT",
          body: formData,
          headers: {
            "x-auth-token": localStorage.getItem("userDetails")
              ? JSON.parse(localStorage.getItem("userDetails")).token
              : "",
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        toast.success("Community updated successfully!");
        onUpdate(data.community);
        onClose();
      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (error) {
      console.error("Error updating community:", error);
      toast.error("An error occurred while updating the community.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Community</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Community Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Community Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Uploader cover={profilePicture} setCover={setProfilePicture} />
          <div className="modal-actions">
            <button type="submit" className="btn">
              Update
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

EditCommunityModal.propTypes = {
  community: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default EditCommunityModal;