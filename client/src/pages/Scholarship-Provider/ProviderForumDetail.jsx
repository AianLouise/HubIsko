import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../../components/ProviderSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../../redux/user/userSlice';
import { useEffect, useRef, useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';


export default function ProviderForumDetail() {
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
   } catch (error) {
     console.log(error);
   }
 };

 const maxUsernameLength = 6;
 const truncatedUsername = currentUser.username.length > maxUsernameLength 
 ? currentUser.username.slice(0, maxUsernameLength) + '...' 
 : currentUser.username;

    const [post, setPost] = useState({});
    const { postId } = useParams();

    useEffect(() => {
        fetchPost();
    }
    , []);

    const fetchPost = async () => {
        try {
            const response = await fetch(`/api/forums/posts/${postId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setPost(data);
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    }



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
  
        {/* Sidebar component now as a separate component */}
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <main className={`flex-grow bg-[#f8f8fb] transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>

        <div className='max-w-8xl mx-auto px-24 gap-10 flex-col flex'>

        <div className='flex gap-1 mt-10 items-center'>
                        <Link to='/provider-forums'>
                            <button className='bg-white border shadow px-4 py-1 mr-2 rounded-md hover:bg-slate-200 transition ease-in-out'>Forums</button>
                        </Link>
                        <IoMdArrowDropdown className='-rotate-90 text-2xl text-blue-600' />
                        <button className='bg-white border shadow px-4 py-1 ml-2 rounded-md hover:bg-slate-200 transition ease-in-out'>{post.title}</button>
        </div>


        </div>
     
        </main>

        </div>
    );
}   