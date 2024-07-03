import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

export default function Header() {
  const { currentUser } = useSelector(state => state.user);
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    async function fetchLogoUrl() {
      const storage = getStorage();
      const logoRef = ref(storage, '/System Files/logo.jpg'); // Ensure this path is correct
      try {
        const url = await getDownloadURL(logoRef);
        setLogoUrl(url);
      } catch (error) {
        console.error('Error fetching logo URL:', error);
      }
    }

    fetchLogoUrl();
  }, []);

  return (
    <div className='border-b bg-[#f8f8fb] shadow-sm'>
      <div className='flex justify-between max-w-6xl mx-auto p-3 px-20'>
        <Link to='/' className='flex items-center'>
          <div className='bg-blue-600 w-10 h-10 rounded-md mx-2'></div>
          <h1 className='font-bold text-2xl hover:text-slate-600 ease-in-out transition-colors'>HubIsko</h1>
        </Link>
        <ul className='flex gap-8 font-bold text-slate-600  p-2'>
          <li className='hover:text-blue-600 hover:border-b-2 hover:-translate-y-0.5 transition-all ease-in-out'><Link to='/'>Home</Link></li>
          <li className='hover:text-blue-600 hover:border-b-2 hover:-translate-y-0.5 transition-all ease-in-out'><Link to='/scholarship-listing'>Scholarship Listing</Link></li>
          <li className='hover:text-blue-600 hover:border-b-2 hover:-translate-y-0.5 transition-all ease-in-out'><Link to='/about'>About</Link></li>
          {currentUser ? (
            <>
              <Link to='/profile'><img src={currentUser.profilePicture} alt='profile' className='h-7 w-7 rounded-full object-cover' /></Link>
            </>
          ) : (
            <>
              <li><Link to='/login'>Login</Link></li>
              <li><Link to='/register'>Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}