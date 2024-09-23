import React from 'react';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminForumViews = ({ isGridView, currentPage, handlePageChange, paginatedData, itemsPerGrid, itemsPerPage, fillerData }) => {
  const navigate = useNavigate();

  const handleViewPost = (postId) => {
    // Navigate to the post details page or perform any other action
    console.log(`View post with ID: ${postId}`);
    // Example: navigate to the post details page
    // history.push(`/posts/${postId}`);
    navigate(`/admin-forums/post/${postId}`);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  };

  return (
    <>
      {paginatedData.length === 0 ? (
        <div className="flex justify-center items-center h-full bg-slate-200 p-4 shadow">
          <p className="text-gray-500 text-lg">No forum posts available.</p>
        </div>
      ) : (
        <>
          {isGridView ? (
            <div className="flex flex-col justify-between h-full bg-slate-200 p-4 shadow overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow">
                {paginatedData.map((item) => (
                  <div key={item.id} className="bg-white shadow rounded-lg p-6 relative flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
                      <div className='flex gap-2 items-center'>
                        <button className="bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-900 p-2">
                          <FaEdit className='w-5 h-5' />
                        </button>
                        <button className="bg-red-600 text-white rounded-lg flex items-center justify-center hover:bg-red-900 p-2">
                          <FaTrashAlt className='w-5 h-5' />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{truncateText(item.content, 100)}</p>
                    <div className="text-gray-500 text-sm">
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                    <div className='flex justify-end'>
                    <button 
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-white rounded-md flex items-center justify-end"
                          onClick={() => handleViewPost(item._id)} // Add onClick event handler
                        >
                          <FaEdit className="mr-1" /> View Post
                        </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end items-center py-5 px-8 mt-8">
                <div className='flex gap-2 items-center bg-white rounded-md border shadow px-6 py-2'>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`rounded-full ${currentPage === 1 ? 'text-gray-400' : 'text-blue-600 hover:text-blue-900'}`}
                  >
                    <MdOutlineKeyboardArrowRight className="w-8 h-8 rotate-180" />
                  </button>
                  <div className="px-4">
                    <span className="text-sm">
                      Page {currentPage} / {Math.ceil(fillerData.length / itemsPerGrid)}
                    </span>
                  </div>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === Math.ceil(fillerData.length / itemsPerGrid)}
                    className={`rounded-full ${currentPage === Math.ceil(fillerData.length / itemsPerGrid) ? 'text-gray-400' : 'text-blue-600 hover:text-blue-900'}`}
                  >
                    <MdOutlineKeyboardArrowRight className="w-8 h-8" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-between border rounded-md bg-white h-full overflow-y-auto shadow-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-100">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap max-w-xs overflow-hidden text-ellipsis text-sm text-gray-500">
                        {item.content}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                      <td className="flex gap-2 items-center px-6 py-4 whitespace-nowrap">
                        <button
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-white rounded-md flex items-center"
                          onClick={() => handleViewPost(item._id)} // Add onClick event handler
                        >
                          <FaEdit className="mr-1" /> View Post
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end gap-4 items-center py-4 px-8 bg-gray-50 border-t">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`rounded-full ${currentPage === 1 ? 'text-gray-400' : 'text-blue-600 hover:text-blue-900'}`}
                >
                  <MdOutlineKeyboardArrowRight className="w-8 h-8 rotate-180" />
                </button>
                <div>
                  <span className="text-sm">
                    Page {currentPage} / {Math.ceil(fillerData.length / itemsPerPage)}
                  </span>
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === Math.ceil(fillerData.length / itemsPerPage)}
                  className={`rounded-full ${currentPage === Math.ceil(fillerData.length / itemsPerPage) ? 'text-gray-400' : 'text-blue-600 hover:text-blue-900'}`}
                >
                  <MdOutlineKeyboardArrowRight className="w-8 h-8" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default AdminForumViews;