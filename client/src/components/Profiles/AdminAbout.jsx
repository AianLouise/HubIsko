import React from 'react';
import { FaBullseye, FaEye, FaHeart, FaHistory, FaEnvelope, FaPhone } from 'react-icons/fa';

const AdminAbout = () => (
  <div className='border-2 rounded-md p-10 flex flex-col bg-white mb-20'>
    <h2 className='text-2xl font-bold mb-4 text-center'>About HubIsko</h2>
    <div className='flex flex-col gap-4'>
      <div className='flex items-center'>
        <FaBullseye className='text-blue-600 w-5 h-5 mr-4' />
        <p className='text-lg'>
          <strong>Mission:</strong> To provide accessible and quality education to all students through scholarships and educational programs.
        </p>
      </div>
      <div className='flex items-center'>
        <FaEye className='text-blue-600 w-6 h-6 mr-4' />
        <p className='text-lg'>
          <strong>Vision:</strong> To be the leading platform for scholarship opportunities, empowering students to achieve their academic and career goals.
        </p>
      </div>
      <div className='flex items-center'>
        <FaHeart className='text-blue-600 w-5 h-5 mr-4' />
        <p className='text-lg'>
          <strong>Values:</strong> Integrity, Excellence, Inclusivity, Innovation, and Collaboration.
        </p>
      </div>
      <div className='flex items-center'>
        <FaHistory className='text-blue-600 w-9 h-9 mr-4' />
        <p className='text-lg'>
          <strong>History:</strong> HubIsko was founded in [Year] with the aim of bridging the gap between students and scholarship providers. Over the years, we have helped thousands of students secure scholarships and achieve their dreams.
        </p>
      </div>
      <div className='flex items-center'>
        <FaEnvelope className='text-blue-600 w-4 h-4 mr-4' />
        <p className='text-lg'>
          <strong>Contact Information:</strong> You can reach us at connectwithhubisko@gmail.com
        </p>
      </div>
      <div className='flex items-center'>
        <FaPhone className='text-blue-600 w-4 h-4 mr-4' />
        <p className='text-lg'>
          <strong>Phone:</strong> (123) 456-7890
        </p>
      </div>
    </div>
  </div>
);

export default AdminAbout;