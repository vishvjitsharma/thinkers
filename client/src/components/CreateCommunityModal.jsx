import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { CommunityState } from "../context/CommunityContext";

const CreateCommunityModal = ({ onClose, setSelectedCommunity }) => {
  const { setCommunities } = CommunityState();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!title || !description || !profilePicture) {
    toast.error("All fields are required!");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("profilePicture", profilePicture);

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/community`, {
      method: "POST",
      body: formData,
      headers: {
        "x-auth-token": localStorage.getItem("userDetails")
          ? JSON.parse(localStorage.getItem("userDetails")).token
          : "",
      },
    });

    if (response.status === 201) {
      const data = await response.json();
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));

      // Add the full `createdBy` object to the community
      const updatedCommunity = {
        ...data.community,
        createdBy: {
          _id: userDetails._id,
          username: userDetails.username,
        },
      };

      setCommunities((prev) => [...prev, updatedCommunity]);
      setSelectedCommunity(updatedCommunity); // Set the newly created community
      toast.success("Community created successfully!");
      onClose();
    } else {
      const error = await response.json();
      toast.error(error.message);
    }
  } catch (error) {
    console.error("Error creating community:", error);
    toast.error("An error occurred while creating the community.");
  }
};

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create Community</h2>
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
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePicture(e.target.files[0])}
            required
          />
          <div className="modal-actions">
            <button type="submit" className="btn">
              Create
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

CreateCommunityModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  setSelectedCommunity: PropTypes.func.isRequired, // Add prop validation
};

export default CreateCommunityModal;