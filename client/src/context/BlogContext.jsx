import { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";

const BlogContext = createContext({});

const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = useCallback(async (communityId) => {
    if (!communityId) {
      console.error("Community ID is required to fetch blogs.");
      setBlogs([]);
      return;
    }

    try {
      console.log("Fetching blogs for community ID:", communityId);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/blog/community/${communityId}`
      );

      if (response.status === 200) {
        const data = await response.json();
        console.log("Fetched blogs from API:", data.blogs);
        setBlogs(data.blogs);
      } else {
        console.error("Failed to fetch blogs:", response.statusText);
        setBlogs([]);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
    }
  }, []);

  return (
    <BlogContext.Provider value={{ blogs, setBlogs, fetchBlogs }}>
      {children}
    </BlogContext.Provider>
  );
};

BlogProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const BlogState = () => {
  return useContext(BlogContext);
};

export default BlogProvider;