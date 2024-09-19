import React from 'react';
import AdminForumViews from './AdminForumViews';


export const adminPostsData = [
    { id: 1, title: "Admin Post 1", description: "Description for Admin Post 1", date: "2023-10-01" },
    { id: 2, title: "Admin Post 2", description: "Description for Admin Post 2", date: "2023-10-02" },
    { id: 3, title: "Admin Post 3", description: "Description for Admin Post 3", date: "2023-10-03" },
    { id: 4, title: "Admin Post 4", description: "Description for Admin Post 4", date: "2023-10-04" },
    { id: 5, title: "Admin Post 5", description: "Description for Admin Post 5", date: "2023-10-05" },
    { id: 6, title: "Admin Post 6", description: "Description for Admin Post 6", date: "2023-10-06" },
    { id: 7, title: "Admin Post 7", description: "Description for Admin Post 7", date: "2023-10-07" },
    { id: 8, title: "Admin Post 8", description: "Description for Admin Post 8", date: "2023-10-08" },
  ];
  const AdminPosts = ({ isGridView, currentPage, handlePageChange, itemsPerGrid, itemsPerPage }) => {
  const paginatedData = adminPostsData.slice((currentPage - 1) * (isGridView ? itemsPerGrid : itemsPerPage), currentPage * (isGridView ? itemsPerGrid : itemsPerPage));

  return (
    <AdminForumViews
      isGridView={isGridView}
      currentPage={currentPage}
      handlePageChange={handlePageChange}
      paginatedData={paginatedData}
      itemsPerGrid={itemsPerGrid}
      itemsPerPage={itemsPerPage}
      fillerData={adminPostsData}
    />
  );
};

export default AdminPosts;