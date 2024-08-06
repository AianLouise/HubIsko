import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../../components/ProviderSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../../redux/user/userSlice';
import { useEffect, useRef, useState } from 'react';



export default function PostScholarship() {
  // State initialization
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Redux hooks
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);

  // Toggle functions
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Effect hook for handling clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signOut());
      navigate('/'); // Navigate to home page
    } catch (error) {
      console.log(error);
    }
  };

  const maxUsernameLength = 6;
  const truncatedUsername = currentUser.username.length > maxUsernameLength
    ? currentUser.username.slice(0, maxUsernameLength) + '...'
    : currentUser.username;

  return (
    <div className={`flex flex-col min-h-screen font-medium`}>
      {/* Header component inline with conditional padding */}
      <header className={`bg-white text-gray-800 p-4 flex justify-between items-center shadow border-b ${sidebarOpen ? 'pl-64' : 'pl-0'}`}>
        <div className="max-w-8xl w-full mx-auto px-24 flex justify-between items-center">

          <div className='flex items-center gap-2'>
            <button onClick={toggleSidebar} className="text-blue-600">
              <FontAwesomeIcon icon={faBars} className=' w-4 h-4 ' />
            </button>

            <h1 className="text-lg font-bold text-blue-500">Provider Dashboard</h1>
            <h1 className="text-lg font-bold text-blue-500">/ Home </h1>
          </div>

          <div className="flex gap-2 items-center">
            <span className="text-base">{truncatedUsername}</span>
            <div className="relative" ref={dropdownRef}>
              <img src={currentUser.profilePicture || 'https://via.placeholder.com/40'} alt="Profile" className="h-8 w-8 rounded-full" onClick={toggleDropdown} />
              {dropdownOpen && (
                <div className="absolute mt-2 right-0 bg-white text-gray-800 shadow-lg rounded-md p-2 w-52 z-50 font-medium">
                  <ul>
                    <li className="p-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                    <li className="p-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                    <li className="p-2 hover:bg-gray-100 cursor-pointer" onClick={handleSignOut}>Sign out</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <main className={`flex-grow bg-[#f8f8fb] transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>

        {/* Filler lang to boss since di ko pa alam ano mga requiements ng pag hohost ng scholarship eah */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-8">
            <div className="flex gap-4 items-center">
              <h1 className="text-3xl font-bold text-gray-800">Post a Scholarship</h1>
              <div className="bg-blue-600 w-36 h-36 rounded-md"></div>
            </div>
            <p className="text-lg text-gray-600">Fill out the form below to post a scholarship</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form action="" className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <label htmlFor="scholarship-name" className="text-lg font-medium text-gray-800">Scholarship Name</label>
              <input type="text" id="scholarship-name" className="border border-gray-300 p-2 rounded-md" placeholder="Enter scholarship name" />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="scholarship-description" className="text-lg font-medium text-gray-800">Scholarship Description</label>
              <textarea name="" id="scholarship-description" cols="30" rows="10" className="border border-gray-300 p-2 rounded-md" placeholder="Enter scholarship description"></textarea>
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="scholarship-amount" className="text-lg font-medium text-gray-800">Scholarship Amount</label>
              <input type="number" id="scholarship-amount" className="border border-gray-300 p-2 rounded-md" placeholder="Enter scholarship amount" />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="scholarship-requirements" className="text-lg font-medium text-gray-800">Scholarship Requirements</label>
              <textarea name="" id="scholarship-requirements" cols="30" rows="10" className="border border-gray-300 p-2 rounded-md" placeholder="Enter scholarship requirements"></textarea>
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="scholarship-deadline" className="text-lg font-medium text-gray-800">Scholarship Deadline</label>
              <input type="date" id="scholarship-deadline" className="border border-gray-300 p-2 rounded-md" placeholder="Enter scholarship deadline" />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="scholarship-website" className="text-lg font-medium text-gray-800">Scholarship Website</label>
              <input type="text" id="scholarship-website" className="border border-gray-300 p-2 rounded-md" placeholder="Enter scholarship website" />

            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="scholarship-email" className="text-lg font-medium text-gray-800">Scholarship Email</label>
              <input type="email" id="scholarship-email" className="border border-gray-300 p-2 rounded-md" placeholder="Enter scholarship email" />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="scholarship-phone" className="text-lg font-medium text-gray-800">Scholarship Phone</label>
              <input type="tel" id="scholarship-phone" className="border border-gray-300 p-2 rounded-md" placeholder="Enter scholarship phone" />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="scholarship-address" className="text-lg font-medium text-gray-800">Scholarship Address</label>
              <input type="text" id="scholarship-address" className="border border-gray-300 p-2 rounded-md" placeholder="Enter scholarship address" />
            </div>

            <div className="flex flex-col gap-4">
              <label htmlFor="scholarship-image" className="text-lg font-medium text-gray-800">Scholarship Image</label>
              <input type="file" id="scholarship-image" className="border border-gray-300 p-2 rounded-md" />
            </div>

            <div className="flex flex-col gap-4">
              <button className="bg-blue-600 text-white p-2 rounded-md">Post Scholarship</button>
            </div>
          </form>
        </div>




      </main>

    </div>
  );
}