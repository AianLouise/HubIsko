import React from 'react';
import AdminForumViews from './AdminForumViews';


export const studentPostsData = [
    { id: 1, title: "Student Post 1", description: "Description for Student Post 1", date: "2023-10-01" },
    { id: 2, title: "Student Post 2", description: "Description for Student Post 2", date: "2023-10-02" },
    { id: 3, title: "Student Post 3", description: "Description for Student Post 3", date: "2023-10-03" },
    { id: 4, title: "Student Post 4", description: "Description for Student Post 4", date: "2023-10-04" },
    { id: 5, title: "Student Post 5", description: "Description for Student Post 5", date: "2023-10-05" },
    { id: 6, title: "Student Post 6", description: "Description for Student Post 6", date: "2023-10-06" },
    { id: 7, title: "Student Post 7", description: "Description for Student Post 7", date: "2023-10-07" },
    { id: 8, title: "Student Post 8", description: "Description for Student Post 8", date: "2023-10-08" },
  ];

  const StudentPosts = ({ isGridView, currentPage, handlePageChange, itemsPerGrid, itemsPerPage }) => {
  const paginatedData = studentPostsData.slice((currentPage - 1) * (isGridView ? itemsPerGrid : itemsPerPage), currentPage * (isGridView ? itemsPerGrid : itemsPerPage));

  return (
    <AdminForumViews
      isGridView={isGridView}
      currentPage={currentPage}
      handlePageChange={handlePageChange}
      paginatedData={paginatedData}
      itemsPerGrid={itemsPerGrid}
      itemsPerPage={itemsPerPage}
      fillerData={studentPostsData}
    />
  );
};

export default StudentPosts;