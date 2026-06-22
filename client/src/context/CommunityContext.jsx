import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const CommunityContext = createContext({});

const CommunityProvider = ({ children }) => {
  const [communities, setCommunities] = useState([]);
  
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/community`);
        if (response.status === 200) {
          const data = await response.json();
          console.log("Fetched Communities:", data.communities); // Debugging
          setCommunities(data.communities);
        } else {
          console.error("Failed to fetch communities:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching communities:", error);
      }
    };
  
    fetchCommunities();
  }, []);

  return (
    <CommunityContext.Provider value={{ communities, setCommunities }}>
      {children}
    </CommunityContext.Provider>
  );
};

CommunityProvider.propTypes = {   
  children: PropTypes.node.isRequired,
};

export const CommunityState = () => {
  return useContext(CommunityContext);
};

export default CommunityProvider;