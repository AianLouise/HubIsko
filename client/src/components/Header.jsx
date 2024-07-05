import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { useDispatch } from 'react-redux';
import { signOut } from '../redux/user/userSlice';

export default function Header() {
  const dispatch = useDispatch();
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

  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='border-b bg-[#f8f8fb] shadow-sm'>
      <div className='flex justify-between max-w-6xl mx-auto p-5 px-20'>
        <Link to='/' className='flex items-center'>
          <div className='bg-blue-600 w-10 h-10 rounded-md mx-2'></div>
          <h1 className='font-bold text-2xl hover:text-slate-600 ease-in-out transition-colors'>HubIsko</h1>
        </Link>
        <ul className='flex gap-8 font-bold text-slate-600'>
          <li className='p-2 hover:text-blue-600 hover:border-b-2 hover:-translate-y-0.5 transition-all ease-in-out'><Link to='/'>Home</Link></li>
          {currentUser && currentUser.role === 'applicant' && (
            <li className='p-2 hover:text-blue-600 hover:border-b-2 hover:-translate-y-0.5 transition-all ease-in-out'><Link to='/scholar-dashboard'>Scholar Dashboard</Link></li>
          )}
          <li className='p-2 hover:text-blue-600 hover:border-b-2 hover:-translate-y-0.5 transition-all ease-in-out'><Link to='/scholarship-listing'>Scholarship Listing</Link></li>
          <li className='p-2 hover:text-blue-600 hover:border-b-2 hover:-translate-y-0.5 transition-all ease-in-out'><Link to='/about'>About</Link></li>
          {currentUser ? (
            <div className="relative"> {/* This div wraps both the image and the dropdown */}
              <img src={currentUser.profilePicture} alt='profile' className='h-11 w-11 p-2 rounded-full object-cover cursor-pointer' onClick={toggleDropdown} />
              {showDropdown && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                  {/* Dropdown items here */}
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Manage Account</Link>
                  <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <li className='border p-2 px-4 rounded-full hover:bg-slate-200'><Link to='/login'>Login</Link></li>
              <li className='bg-blue-600 text-white p-2 px-4 rounded-full hover:bg-blue-800'><Link to='/register'>Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
