import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';

export default function OthersProfile() {
  const { id } = useParams(); // Extract user ID from URL
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/forums/user/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-grow bg-[#f8f8fb] no-scrollbar font-medium'>
        <div className='border-b mb-8 py-8'>
          <div className='flex flex-row items-center mx-auto max-w-6xl gap-10 px-24'>
            <div className='bg-blue-600 w-36 h-36 my-8 rounded-md'></div>
            <div className='flex flex-col items-start gap-2 w-1/2 '>
              <span className='text-xl font-medium text-gray-600'>Student</span>
              <span className='text-4xl font-bold text-gray-800'>{user.username}</span>
              <span className='text-xl font-medium text-gray-600'>Followers: {user.followers}</span>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-4 max-w-6xl px-24 mx-auto'>
          <div className='flex flex-row gap-4 justify-between font-semibold mb-6'>
            <button className='border text-center rounded-xl w-1/2 px-16 py-4 bg-slate-200 hover:bg-slate-300 focus:bg-white focus:shadow-md'>Profile</button>
            <button className='border text-center rounded-xl w-1/2 px-16 py-4 bg-slate-200 hover:bg-slate-300 focus:bg-white focus:shadow-md'>Posts</button>
            <button className='border text-center rounded-xl w-1/2 px-16 py-4 bg-slate-200 hover:bg-slate-300 focus:bg-white focus:shadow-md'>Comments</button>
          </div>

          <div className='border-2 rounded-md p-10 flex justify-center items-center bg-white h-96 mb-20'>
            <span>Container</span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}