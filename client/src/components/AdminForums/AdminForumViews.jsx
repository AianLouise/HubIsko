import React from 'react';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const AdminForumViews = ({ isGridView, currentPage, handlePageChange, paginatedData, itemsPerGrid, itemsPerPage, fillerData }) => {
  return (
    <>
      {isGridView ? (
        <div className="flex flex-col justify-between h-full bg-slate-200 p-4 shadow overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-grow">
            {paginatedData.map((item) => (
              <div key={item.id} className="bg-white shadow rounded-md p-4 relative">
                <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">{item.title}</h3>
                <div className='flex gap-2 items-center'>
                  <button className="bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-900 p-1">
                    <FaEdit className='w-5 h-5' />
                  </button>
                  <button className="bg-red-600 text-white rounded-lg flex items-center justify-center hover:bg-red-900 p-1">
                    <FaTrashAlt className='w-5 h-5' />
                  </button>
                </div>
                </div>
                <p>{item.description}</p>
                <p className="text-sm text-gray-500">{item.date}</p>
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
        <div className="flex flex-col justify-between border rounded-md bg-white h-full overflow-y-auto">
          <table className="min-w-full divide-y border-b divide-gray-200">
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
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.date}</td>
                  <td className="flex gap-4 items-center px-6 py-4 whitespace-nowrap">
                    <button className="bg-blue-600 hover:bg-blue-700 px-2 text-white rounded-md">Edit</button>
                    <button className='bg-red-600 hover:bg-red-700 px-2 text-white rounded-md'>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end gap-4 items-center py-2 px-8">
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
  );
};

export default AdminForumViews;