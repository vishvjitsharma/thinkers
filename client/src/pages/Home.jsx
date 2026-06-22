import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import BlogSection from "../components/BlogSection";
import CreateCommunityModal from "../components/CreateCommunityModal";
import "../styles/community.css";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
const Home = () => {
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log("Home component mounted");
    return () => {
      console.log("Home component unmounted");
    };
  }, []);

  console.log("Selected Community:", selectedCommunity);

  const handleSelectCommunity = (community) => {
    if (community === "create") {
      setIsModalOpen(true); // Open the "Create Community" modal
    } else {
      setSelectedCommunity(community); // Set the selected community
    }
  };

  const handleCommunityDeleted = async (communityId) => {
    Swal.fire({
      title: "Delete Community",
      text: "Are you sure you want to delete this community?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/community/${communityId}`, {
          method: "DELETE",
          headers: {
            "x-auth-token": localStorage.getItem("userDetails")
              ? JSON.parse(localStorage.getItem("userDetails")).token
              : "",
          },
        });
  
        if (response.status === 200) {
          setSelectedCommunity(null);
          Swal.fire("Deleted!", "The community has been deleted.", "success");
        } else {
          Swal.fire("Error!", "Failed to delete the community.", "error");
        }
      }
    });
  };

  return (
    <div className="community-layout">
      {/* Sidebar for listing communities */}
      <Sidebar onSelectCommunity={handleSelectCommunity} />

      {/* Main section for displaying blogs */}
      {selectedCommunity ? (
        <BlogSection
          community={selectedCommunity}
          onCommunityDeleted={handleCommunityDeleted}
        />
      ) : (
        <div className="blog-section">
          <h1>Select a Community to View Blogs</h1>
        </div>
      )}

      {/* Modal for creating a community */}
      {isModalOpen && (
        <CreateCommunityModal
          onClose={() => setIsModalOpen(false)}
          setSelectedCommunity={setSelectedCommunity} // Pass the function as a prop
        />
      )}
    </div>
  );
};

export default Home;