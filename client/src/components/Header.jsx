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
    <div className='bg-slate-200'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/' className='flex items-center'>
          <img src={logoUrl || '/default-logo.png'} alt='HubIsko Logo' className='h-8 w-auto mr-2' />
          <h1 className='font-bold'>HubIsko</h1>
        </Link>
        <ul className='flex gap-4'>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/scholarship-listing'>Scholarship Listing</Link></li>
          <li><Link to='/about'>About</Link></li>
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