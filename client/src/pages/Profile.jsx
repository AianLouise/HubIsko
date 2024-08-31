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

export default function Profile() {
  const currentUser = useSelector((state) => state.user.currentUser);

  const [ShowModal, setShowModal] = useState(false);
  const [ShowModal2, setShowModal2] = useState(false);
  const [selectedTab, setSelectedTab] = useState('About');
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submitTrigger, setSubmitTrigger] = useState(false);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);


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
      const fileName = `${currentUser.username}_${fileNameWithoutExtension}_${format(new Date(), 'yyyyMMdd')}.${fileExtension}`;
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
    };

    try {
      const response = await fetch('/api/forums/post', {
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

      // Reset form and close modal
      setFormData({ title: '', content: '' });
      setSelectedFiles([]);
      handleCloseModal2();
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
      const response = await fetch(`/api/profile/forum-posts/${currentUser._id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data && data.forumPosts) {
        setPosts(data.forumPosts); // Set forum posts
        setUsername(data.username); // Set username
        setProfilePicture(data.profilePicture); // Set profile picture
      } else {
        setPosts([]); // Set to empty array if no forum posts
        setUsername(''); // Clear username if no forum posts
        setProfilePicture(''); // Clear profile picture if no forum posts
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]); // Set to empty array on error
      setUsername(''); // Clear username on error
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
      <AccountManagement />
      <main className="flex-grow bg-[#f8f8fb]">
        <div className='border-b mb-8 py-8'>
          <div className='flex flex-row items-center mx-auto max-w-6xl gap-4 lg:gap-10 px-4 lg:px-24'>
            <img
              src={currentUser.profilePicture}
              alt={`${currentUser.username}'s profile`}
              className='w-36 h-36 my-8 rounded-md object-cover'
            />
            <div className='flex flex-col items-start gap-2 lg:w-1/2 '>
              <span className='text-xl font-medium text-gray-600'>
                {currentUser.role === 'scholarship_provider' ? 'Organization' : currentUser.role === 'applicant' ? 'Student' : currentUser.role === 'admin' ? 'Admin' : currentUser.role}
              </span>
              <span className='text-3xl font-bold text-gray-800'>
                {currentUser.role === 'scholarship_provider' ? currentUser.scholarshipProviderDetails.organizationName : currentUser.username}
              </span>
              <span className='text-xl font-medium text-gray-600'>Followers: {currentUser.followers}</span>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-4 max-w-6xl lg:px-24 mx-auto px-2'>
          <div className='grid grid-cols-2 lg:flex lg:flex-row gap-4 justify-between font-semibold mb-6'>
            <button className={`border text-center rounded-xl lg:w-1/2 lg:px-16 py-4 ${selectedTab === 'About' ? 'bg-white shadow-md' : 'bg-slate-200 hover:bg-slate-300'}`}
              onClick={() => handleTabClick('About')}
            >
              About
            </button>

            <button className={`border text-center rounded-xl lg:w-1/2 lg:px-16 py-4 ${selectedTab === 'Posts' ? 'bg-white shadow-md' : 'bg-slate-200 hover:bg-slate-300'}`}
              onClick={() => handleTabClick('Posts')}
            >
              Posts
            </button>
          </div>

          {selectedTab === 'About' && (
            <div className='border-2 rounded-md p-10 flex flex-col bg-white h-auto mb-20'>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Excepturi, a. Libero id ad corrupti deserunt nisi repellendus quisquam dolores ipsum.
            </div>
          )}

          {selectedTab === 'Posts' && (
            <div className="mb-20">
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-2 justify-between font-medium">
                <button onClick={handleModal2} className="flex gap-1 items-center bg-blue-600 text-white px-6 py-4 lg:py-2 rounded-md">
                  <BiPlus className="w-6 h-6" />
                  <span>Create a Post</span>
                </button>

                {/* Searchbar */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search Posts"
                    className="border-2 border-slate-500 rounded-md px-4 py-2 w-full lg:w-[300px]"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>

              <div className='w-full flex justify-center border-t-2 mt-14'>
                <span className='text-2xl bg-[#f8f8fb] -translate-y-5 px-8 font-medium text-slate-500'>Your Forum Posts</span>
              </div>

              <div className='grid grid-cols-1 sm:grid-rows-1 gap-8 pb-12'>
                {posts.length === 0 ? (
                  <p>No posts available.</p>
                ) : (
                  filteredPosts
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort posts by creation date in descending order
                    .map((post) => (
                      <Link to={`/forums/post/${post._id}`} key={post._id}>
                        <div className='flex flex-col gap-2 px-8 py-6 border rounded-md bg-white shadow cursor-pointer hover:bg-slate-100 hover:-translate-y-1 transition ease-in-out' onClick={() => handlePostClick(post._id)}>
                          <div className='flex flex-row gap-3'>
                            <img
                              src={profilePicture || 'default-profile-pic-url'} // Use a default profile picture if not available
                              alt={`${username}'s profile`}
                              className='w-12 h-12 rounded-full object-cover' // Add object-cover to maintain aspect ratio
                            />
                            <div className='flex flex-col'>
                              <span className='font-medium'>{username}</span>
                              <span className='text-sm text-slate-500'>
                                {new Date(post.createdAt).toLocaleString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: 'numeric',
                                  minute: 'numeric',
                                  hour12: true,
                                })}
                              </span>
                            </div>
                          </div>
                          <span className='font-bold'>{post.title}</span>
                          <span className='text-sm text-slate-600'>{post.content}</span>

                          {/* Attachments Section */}
                          {post.attachments && post.attachments.length > 0 && (
                            <div className='flex flex-wrap gap-2 mt-4'>
                              {post.attachments.map((attachment, index) => (
                                <a href={attachment} target='_blank' rel='noopener noreferrer' key={index} className='w-24 h-24 border rounded-md overflow-hidden'>
                                  <img src={attachment} alt={`attachment-${index}`} className='w-full h-full object-cover' />
                                </a>
                              ))}
                            </div>
                          )}

                          <div className='border-t'>
                            <div className='flex flex-row justify-between mt-3 gap-2'>
                              <div className='flex flex-row gap-2'>
                                <div className='flex flex-row gap-1 px-2'>
                                  <FaRegHeart className='w-6 h-6 font-bold text-blue-600' />
                                  <span>{post.totalLikes}</span>
                                </div>
                                <div className='flex flex-row gap-1'>
                                  <BiCommentDots className='w-6 h-6 text-blue-600' />
                                  <span>{post.totalComments}</span>
                                </div>
                              </div>
                              <div className='flex flex-row gap-1 pr-2'>
                                <FaRegEye className='w-6 h-6 text-blue-600' />
                                <span>{post.views}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {ShowModal && (
        <div className='fixed z-20 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
            <div className="flex items-center justify-between mb-4">
              <h2 className='text-2xl font-bold'>Edit Name</h2>
              <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-800">
                <CgClose onClick={handleCloseModal} />
              </button>
            </div>

            <form className='flex flex-col'>
              <label htmlFor='name' className='font-semibold text-gray-600'>Name</label>
              <input type='text' id='name' className='border rounded-md p-2 mb-4' />

              <span className="text-slate-500 text-sm my-2">You'll have a 30 days cooldown after you changed your name</span>
              <button type='submit' className='bg-blue-600 text-white font-semibold rounded-md py-2'>Save</button>
            </form>
          </div>
        </div>
      )}

      {ShowModal2 && (
        <div className='fixed z-20 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-lg max-h-full overflow-y-auto'>
            <div className="flex flex-row items-center justify-between mb-4">
              <h2 className='text-2xl font-bold'>Create a Post</h2>
              <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-800" onClick={handleCloseModal2}>
                <CgClose />
              </button>
            </div>

            <form className='flex flex-col' onSubmit={handleSubmit}>
              <label htmlFor='title' className='font-semibold text-gray-600'>Title</label>
              <input type='text' id='title' name='title' value={formData.title} onChange={handleChange} className='border rounded-md p-2 mb-4' />
              <label htmlFor='content' className='font-semibold text-gray-600'>Content</label>
              <textarea id='content' name='content' value={formData.content} onChange={handleChange} className='border rounded-md p-2 mb-4' />

              <label htmlFor='attachments' className='font-semibold text-gray-600 mb-2'>Attachments</label>
              <div className='relative border border-dashed border-gray-400 rounded-md p-4 mb-4'>
                <input
                  type='file'
                  id='attachments'
                  className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                  multiple
                  onChange={handleFileChange}
                />
                <div className='flex flex-col items-center justify-center h-full'>
                  <svg className='w-12 h-12 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 4v16m8-8H4'></path>
                  </svg>
                  <p className='text-gray-600 mt-2'>Drag & drop files here or click to upload</p>
                </div>
              </div>

              {selectedFiles.length > 0 && (
                <div className='mb-4'>
                  <div className='flex flex-row flex-wrap gap-2'>
                    {selectedFiles.map((fileObj, index) => (
                      <div key={index} className='relative w-16 h-16'>
                        <img src={fileObj.url} alt={`attachment-${index}`} className='w-full h-full object-cover rounded-md' />
                        <button
                          type='button'
                          className='absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 hover:bg-red-800'
                          onClick={() => handleRemoveFile(index)}
                        >
                          <CgClose />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type='submit'
                className={`font-semibold rounded-md py-2 ${submitTrigger ? 'bg-gray-400 text-gray-700' : 'bg-blue-600 text-white'}`}
                disabled={submitTrigger}
              >
                {submitTrigger ? 'Creating Post...' : 'Create Post'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}