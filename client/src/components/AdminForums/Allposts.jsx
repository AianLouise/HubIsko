import React, { useEffect, useState } from 'react';
import AdminForumViews from './AdminForumViews';

const AllPosts = ({ isGridView, currentPage, handlePageChange, itemsPerGrid, itemsPerPage, searchQuery, sortOrder }) => {
  const [allPostsData, setAllPostsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await fetch('/api/adminForums/forum-posts'); // Fetch data from the backend
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAllPostsData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Filter posts based on search query
  const filteredPosts = allPostsData.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort posts based on sort order
  const sortedPosts = filteredPosts.sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOrder === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return 0;
  });

  const paginatedData = sortedPosts.slice((currentPage - 1) * (isGridView ? itemsPerGrid : itemsPerPage), currentPage * (isGridView ? itemsPerGrid : itemsPerPage));

  return (
    <AdminForumViews
      isGridView={isGridView}
      currentPage={currentPage}
      handlePageChange={handlePageChange}
      paginatedData={paginatedData}
      itemsPerGrid={itemsPerGrid}
      itemsPerPage={itemsPerPage}
      fillerData={sortedPosts} // Pass sorted posts for pagination
    />
  );
};

export default AllPosts;