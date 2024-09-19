import React from 'react';
import AdminForumViews from './AdminForumViews';

export const ProviderPostsData = [
    { id: 1, title: "Provider Post 1", description: "Description for Provider Post 1", date: "2023-10-01" },
    { id: 2, title: "Provider Post 2", description: "Description for Provider Post 2", date: "2023-10-02" },
    { id: 3, title: "Provider Post 3", description: "Description for Provider Post 3", date: "2023-10-03" },
    { id: 4, title: "Provider Post 4", description: "Description for Provider Post 4", date: "2023-10-04" },
    { id: 5, title: "Provider Post 5", description: "Description for Provider Post 5", date: "2023-10-05" },
    { id: 6, title: "Provider Post 6", description: "Description for Provider Post 6", date: "2023-10-06" },
    { id: 7, title: "Provider Post 7", description: "Description for Provider Post 7", date: "2023-10-07" },
    { id: 8, title: "Provider Post 8", description: "Description for Provider Post 8", date: "2023-10-08" },
  ];

  const ProviderPosts = ({ isGridView, currentPage, handlePageChange, itemsPerGrid, itemsPerPage }) => {
  const paginatedData = ProviderPostsData.slice((currentPage - 1) * (isGridView ? itemsPerGrid : itemsPerPage), currentPage * (isGridView ? itemsPerGrid : itemsPerPage));

  return (
    <AdminForumViews
      isGridView={isGridView}
      currentPage={currentPage}
      handlePageChange={handlePageChange}
      paginatedData={paginatedData}
      itemsPerGrid={itemsPerGrid}
      itemsPerPage={itemsPerPage}
      fillerData={ProviderPostsData}
    />
  );
};

export default ProviderPosts;