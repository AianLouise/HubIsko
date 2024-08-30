import React from 'react';

const ApplicantProfile = ({ user }) => (
  <div  className='border-2 rounded-md p-10 flex justify-center items-center bg-white mb-20'>
    <h2>Applicant Profile</h2>
    <p>Username: {user.username}</p>
    <p>Role: {user.role}</p>
    {/* Add more applicant-specific details here */}
  </div>
);

export default ApplicantProfile;