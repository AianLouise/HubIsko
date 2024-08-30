import React from 'react';

const AdminAbout = ({ user }) => (
  <div className='border-2 rounded-md p-10 flex justify-center items-center bg-white mb-20'>
    <h2>Admin About</h2>
    <p>Username: {user.username}</p>
    <p>Role: {user.role}</p>
    {/* Add more admin-specific details here */}
  </div>
);

export default AdminAbout;