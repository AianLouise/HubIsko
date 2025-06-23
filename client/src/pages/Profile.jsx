import { React, useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import AccountManagement from "./AccountManagement";
import { RiEditFill } from "react-icons/ri";
import { CgClose } from "react-icons/cg";
import { FaRegHeart, FaRegEye } from "react-icons/fa";
import { BiCommentDots, BiPlus } from "react-icons/bi";
import { useSelector } from "react-redux";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Profile() {

  useEffect(() => {
    document.title = "Profile | HubIsko";
    window.scrollTo(0, 0);
  }, []);

  const currentUser = useSelector((state) => state.user.currentUser);

  const [ShowModal, setShowModal] = useState(false);
  const [ShowModal2, setShowModal2] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Posts');
  const [posts, setPosts] = useState([]);
  const [profilePicture, setProfilePicture] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submitTrigger, setSubmitTrigger] = useState(false);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');


  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const fileObjs = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setSelectedFiles((prevFiles) => [...prevFiles, ...fileObjs]);

    // Log file names to the console
    files.forEach(file => console.log(`File added: ${file.name}`));
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleAttachmentClick = () => {
    document.getElementById('fileInput').click();
  };

  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitTrigger(true);

    const storage = getStorage();

    // Upload files to Firebase and get the file URLs
    const uploadedFilePaths = await Promise.all(selectedFiles.map(async (fileObj) => {
      const file = fileObj.file;
      const fileExtension = file.name.split('.').pop(); // Extract the file extension
      const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, ""); // Remove the extension from the original file name
      const uniqueIdentifier = uuidv4(); // Generate a unique identifier
      const fileName = `${currentUser.applicantDetails.firstName}_${currentUser.applicantDetails.lastName}_${fileNameWithoutExtension}_${uniqueIdentifier}.${fileExtension}`; // Create the unique file name
      const storageRef = ref(storage, `forum_uploads/${fileName}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL; // Save the download URL in the database
    }));

    // Send post data to the backend
    const postData = {
      ...formData,
      author: currentUser._id,
      attachments: uploadedFilePaths // Save file paths in the database
    };    try {
      const response = await fetch(`${apiUrl}/api/forums/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Success:', result);

      // Show success message
      setSuccessMessage('Post submitted successfully!');

      // Reset form and close modal
      setFormData({ title: '', content: '' });
      setSelectedFiles([]);
      handleCloseModal2();
      fetchPosts(); // Fetch posts again to update the list

      // Hide success message after a few seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSubmitTrigger(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentUser]);

  useEffect(() => {
    setFilteredPosts(
      posts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, posts]);
  const fetchPosts = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/profile/forum-posts/${currentUser._id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data && data.forumPosts) {
        setPosts(data.forumPosts); // Set forum posts
        setName(data.name); // Set first name
        setProfilePicture(data.profilePicture); // Set profile picture
      } else {
        setPosts([]); // Set to empty array if no forum posts
        setName(''); // Clear first name if no forum posts
        setProfilePicture(''); // Clear profile picture if no forum posts
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]); // Set to empty array on error
      setName(''); // Clear first name on error
      setProfilePicture(''); // Clear profile picture on error
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  }

  const handleModal = () => {
    setShowModal(true);
  }
  const handleCloseModal = () => {
    setShowModal(false);
  }

  const handleModal2 = () => {
    setShowModal2(true);
  }

  const handleCloseModal2 = () => {
    setShowModal2(false);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <AccountManagement />      <main className="flex-grow bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        {/* Profile Header Section */}
        <div className='bg-white border-b border-gray-200 shadow-sm'>
          <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8'>
            <div className='flex flex-col sm:flex-row items-center sm:items-start gap-4 lg:gap-8'>
              {/* Profile Picture */}
              <div className='relative'>
                <img
                  src={currentUser.profilePicture}
                  alt={`${currentUser.applicantDetails.firstName} ${currentUser.applicantDetails.lastName}'s profile`}
                  className='w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full object-cover border-4 border-white shadow-lg'
                />
                <div className='absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white'></div>
              </div>

              {/* Profile Info */}
              <div className='flex-1 text-center sm:text-left w-full'>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div className='space-y-1'>
                    <div className='flex items-center justify-center sm:justify-start gap-2'>
                      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        {currentUser.role === 'scholarship_provider' ? 'Organization' : currentUser.role === 'applicant' ? 'Student' : currentUser.role === 'admin' ? 'Admin' : currentUser.role}
                      </span>
                    </div>
                    <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900'>
                      {currentUser.role === 'scholarship_provider' ? currentUser.scholarshipProviderDetails.organizationName : `${currentUser.applicantDetails.firstName} ${currentUser.applicantDetails.lastName}`}
                    </h1>
                    <div className='flex items-center justify-center sm:justify-start gap-4 text-sm text-gray-500'>
                      <span className='flex items-center gap-1'>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        Philippines
                      </span>
                      <span className='flex items-center gap-1'>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Joined {format(new Date(currentUser.createdAt), 'MMM yyyy')}
                      </span>
                    </div>
                  </div>

                  {/* Desktop Edit Button */}
                  <div className='hidden sm:block'>
                    <button
                      className='inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl'
                      onClick={() => navigate('/account-settings')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      Edit Profile
                    </button>
                  </div>
                </div>

                {/* Mobile Edit Button */}
                <button
                  className='block sm:hidden w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg'
                  onClick={() => navigate('/account-settings')}
                >
                  <span className='flex items-center justify-center gap-2'>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit Profile
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>        {/* Main Content */}
        <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8'>
          {/* Navigation Tabs */}
          <div className='mb-6'>
            <nav className='flex space-x-1 bg-white p-1 rounded-lg shadow-sm border border-gray-200'>
              <button
                className={`flex-1 px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ${selectedTab === 'Posts'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                onClick={() => handleTabClick('Posts')}
              >
                <span className='flex items-center justify-center gap-2'>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                  </svg>
                  Forum Posts
                  <span className='ml-1 bg-white bg-opacity-20 text-xs px-1.5 py-0.5 rounded-full'>
                    {posts.length}
                  </span>
                </span>
              </button>
            </nav>
          </div>

          {/* {selectedTab === 'About' && (
            <div className='border-2 rounded-md p-10 flex flex-col bg-white h-auto mb-20'>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Excepturi, a. Libero id ad corrupti deserunt nisi repellendus quisquam dolores ipsum.
            </div>
          )} */}          {selectedTab === 'Posts' && (
            <div className="space-y-6">
              {/* Action Bar */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  {/* Create Post Button */}
                  <button
                    onClick={handleModal2}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <BiPlus className="w-5 h-5" />
                    <span>Create New Post</span>
                  </button>

                  {/* Search Bar */}
                  <div className="w-full sm:w-auto relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search your posts..."
                      className="w-full sm:w-80 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
              </div>

              {/* Posts Section Header */}
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-200'></div>
                </div>
                <div className='relative flex justify-center'>
                  <span className='bg-gradient-to-br from-gray-50 to-blue-50 px-6 py-2 text-lg font-medium text-gray-600 rounded-full border border-gray-200'>
                    Your Forum Posts ({filteredPosts.length})
                  </span>
                </div>
              </div>

              {/* Posts Grid */}
              <div className='space-y-4'>
                {posts.length === 0 ? (
                  <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center'>
                    <div className='mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                      </svg>
                    </div>
                    <h3 className='text-lg font-medium text-gray-900 mb-2'>No posts yet</h3>
                    <p className='text-gray-500 mb-6'>Start sharing your thoughts with the community!</p>
                    <button
                      onClick={handleModal2}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                    >
                      <BiPlus className="w-5 h-5" />
                      Create Your First Post
                    </button>
                  </div>
                ) : filteredPosts.length === 0 ? (
                  <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center'>
                    <div className='mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </div>
                    <p className='text-gray-500'>No posts found matching your search.</p>
                  </div>
                ) : (
                  filteredPosts
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((post) => (
                      <Link to={`/forums/post/${post._id}`} key={post._id} className="block">
                        <article className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer'>
                          {/* Post Header */}
                          <div className='flex items-start gap-3 mb-4'>
                            <img
                              src={profilePicture || 'default-profile-pic-url'}
                              alt={`${currentUser.applicantDetails.firstName} ${currentUser.applicantDetails.lastName}'s profile`}
                              className='w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-100'
                            />
                            <div className='flex-1 min-w-0'>
                              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1'>
                                <h4 className='font-medium text-gray-900 truncate'>{name}</h4>
                                <time className='text-sm text-gray-500 flex-shrink-0'>
                                  {new Date(post.createdAt).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: true,
                                  })}
                                </time>
                              </div>
                            </div>
                          </div>

                          {/* Post Content */}
                          <div className='space-y-3'>
                            <h3 className='text-lg font-semibold text-gray-900 line-clamp-2'>{post.title}</h3>
                            <p className='text-gray-600 text-sm line-clamp-3'>{post.content}</p>

                            {/* Attachments */}
                            {post.attachments && post.attachments.length > 0 && (
                              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4'>
                                {post.attachments.slice(0, 4).map((attachment, index) => (
                                  <div key={index} className='relative aspect-square'>
                                    <img
                                      src={attachment}
                                      alt={`attachment-${index}`}
                                      className='w-full h-full object-cover rounded-lg border border-gray-200'
                                    />
                                    {index === 3 && post.attachments.length > 4 && (
                                      <div className='absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center'>
                                        <span className='text-white font-medium'>+{post.attachments.length - 4}</span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Post Stats */}
                            <div className='flex items-center justify-between pt-3 border-t border-gray-100'>
                              <div className='flex items-center gap-4'>
                                <div className='flex items-center gap-1 text-gray-500'>
                                  <FaRegHeart className='w-4 h-4' />
                                  <span className='text-sm'>{post.totalLikes}</span>
                                </div>
                                <div className='flex items-center gap-1 text-gray-500'>
                                  <BiCommentDots className='w-4 h-4' />
                                  <span className='text-sm'>{post.totalComments}</span>
                                </div>
                              </div>
                              <div className='flex items-center text-blue-600 text-sm font-medium'>
                                Read more
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Success Message */}
      {successMessage && (
        <div className='fixed top-4 right-4 z-50'>
          <div className='bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2'>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {successMessage}
          </div>
        </div>
      )}

      {/* Edit Name Modal - Simplified */}
      {ShowModal && (
        <div className='fixed inset-0 z-50 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4'>
            <div className='fixed inset-0 bg-black bg-opacity-25 transition-opacity' onClick={handleCloseModal}></div>

            <div className='relative bg-white rounded-xl shadow-xl w-full max-w-md'>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className='text-lg font-semibold text-white'>Edit Name</h2>
                  <button
                    className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all duration-200"
                    onClick={handleCloseModal}
                  >
                    <CgClose className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <form className='p-6 space-y-4'>
                <div className='space-y-2'>
                  <label htmlFor='name' className='block text-sm font-semibold text-gray-700'>Name</label>
                  <input
                    type='text'
                    id='name'
                    className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
                    placeholder="Enter your name"
                  />
                </div>
                <p className="text-sm text-gray-500">You'll have a 30 days cooldown after you changed your name</p>
                <button
                  type='submit'
                  className='w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200'
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      )}{/* Create Post Modal */}
      {ShowModal2 && (
        <div className='fixed inset-0 z-50 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4'>
            <div className='fixed inset-0 bg-black bg-opacity-25 transition-opacity' onClick={handleCloseModal2}></div>

            <div className='relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden'>
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className='text-xl font-semibold text-white flex items-center gap-2'>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Create New Post
                  </h2>
                  <button
                    className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all duration-200"
                    onClick={handleCloseModal2}
                  >
                    <CgClose className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                <form className='p-6 space-y-6' onSubmit={handleSubmit}>
                  {/* Title Input */}
                  <div className='space-y-2'>
                    <label htmlFor='title' className='block text-sm font-semibold text-gray-700'>
                      Post Title
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type='text'
                      id='title'
                      name='title'
                      value={formData.title}
                      onChange={handleChange}
                      className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
                      placeholder="What's on your mind?"
                      required
                    />
                  </div>

                  {/* Content Textarea */}
                  <div className='space-y-2'>
                    <label htmlFor='content' className='block text-sm font-semibold text-gray-700'>
                      Content
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                      id='content'
                      name='content'
                      value={formData.content}
                      onChange={handleChange}
                      rows={6}
                      className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none'
                      placeholder="Share your thoughts with the community..."
                      required
                    />
                  </div>

                  {/* File Upload */}
                  <div className='space-y-2'>
                    <label className='block text-sm font-semibold text-gray-700'>Attachments</label>
                    <div className='relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors duration-200'>
                      <input
                        type='file'
                        id='attachments'
                        className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <div className='text-center'>
                        <svg className='mx-auto h-12 w-12 text-gray-400' stroke='currentColor' fill='none' viewBox='0 0 48 48'>
                          <path d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                        </svg>
                        <div className='mt-4'>
                          <p className='text-sm text-gray-600'>
                            <span className='font-medium text-blue-600 hover:text-blue-500'>Click to upload</span> or drag and drop
                          </p>
                          <p className='text-xs text-gray-500'>PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </div>
                    </div>

                    {/* File Preview */}
                    {selectedFiles.length > 0 && (
                      <div className='mt-4'>
                        <h4 className='text-sm font-medium text-gray-700 mb-3'>Selected Files ({selectedFiles.length})</h4>
                        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>
                          {selectedFiles.map((fileObj, index) => (
                            <div key={index} className='relative group'>
                              <img
                                src={fileObj.url}
                                alt={`preview-${index}`}
                                className='w-full h-20 object-cover rounded-lg border border-gray-200'
                              />
                              <button
                                type='button'
                                className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600'
                                onClick={() => handleRemoveFile(index)}
                              >
                                <CgClose className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                      type='submit'
                      disabled={submitTrigger}
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${submitTrigger
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                        }`}
                    >
                      {submitTrigger ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating Post...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                          </svg>
                          Create Post
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}