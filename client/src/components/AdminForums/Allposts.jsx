import React from 'react';
import AdminForumViews from './AdminForumViews';

// Define and export the allPostsData array
export const allPostsData = [
  { id: 1, title: "All Post 1", description: "Description for All Post 1", date: "2023-10-01" },
  { id: 2, title: "All Post 2", description: "Description for All Post 2", date: "2023-10-02" },
  { id: 3, title: "All Post 3", description: "Description for All Post 3", date: "2023-10-03" },
  { id: 4, title: "All Post 4", description: "Description for All Post 4", date: "2023-10-04" },
  { id: 5, title: "All Post 5", description: "Description for All Post 5", date: "2023-10-05" },
  { id: 6, title: "All Post 6", description: "Description for All Post 6", date: "2023-10-06" },
  { id: 7, title: "All Post 7", description: "Description for All Post 7", date: "2023-10-07" },
  { id: 8, title: "All Post 8", description: "Description for All Post 8", date: "2023-10-08" },
];

const AllPosts = ({ isGridView, currentPage, handlePageChange, itemsPerGrid, itemsPerPage }) => {
  const paginatedData = allPostsData.slice((currentPage - 1) * (isGridView ? itemsPerGrid : itemsPerPage), currentPage * (isGridView ? itemsPerGrid : itemsPerPage));

  return (
    <AdminForumViews
      isGridView={isGridView}
      currentPage={currentPage}
      handlePageChange={handlePageChange}
      paginatedData={paginatedData}
      itemsPerGrid={itemsPerGrid}
      itemsPerPage={itemsPerPage}
      fillerData={allPostsData}
    />
  );
};

export default AllPosts;