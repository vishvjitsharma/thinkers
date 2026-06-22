import { useState, useEffect } from "react";
import { CommunityState } from "../context/CommunityContext";

const Sidebar = ({ onSelectCommunity }) => {
  const { communities } = CommunityState();
  const [search, setSearch] = useState("");


  useEffect(() => {
    console.log("Sidebar component mounted");
    return () => {
      console.log("Sidebar component unmounted");
    };
  }, []);

  console.log("Communities in Sidebar:", communities);

  const filteredCommunities = communities.filter((community) =>
    community?.title?.toLowerCase().includes(search.toLowerCase())
  );

  console.log("Filtered Communities:", filteredCommunities);
  
  return (
    <aside className="sidebar">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Communities"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="add-community-btn"
          onClick={() => onSelectCommunity("create")} // Trigger "create" action
        >
          +
        </button>
      </div>
      <ul>
        {filteredCommunities.length > 0 ? (
          filteredCommunities.map((community) => (
            <li
              key={community?._id || Math.random()}
              onClick={() => onSelectCommunity(community)}
            >
              <img
                src={
                  community?.profilePicture
                    ? `${import.meta.env.VITE_API_URL}/uploads/covers/${community.profilePicture}`
                    : "default-image.jpg"
                }
                alt={community?.title || "Untitled"}
              />
              <span>{community?.title || "Untitled Community"}</span>
            </li>
          ))
        ) : (
          <li>No communities found</li>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;