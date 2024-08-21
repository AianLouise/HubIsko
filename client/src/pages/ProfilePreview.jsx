import React, { useState, useEffect } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaHandHolding, FaInfoCircle, FaRegHeart, FaRegEye } from "react-icons/fa";
import { BiCommentDots } from "react-icons/bi";
import { Link, useParams } from 'react-router-dom';

export default function ProfilePreview() {
  const [selectedTab, setSelectedTab] = useState('About');

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const { id } = useParams(); // Get the ID from the URL
  const [user, setUser] = useState(null);
  const [scholarships, setScholarships] = useState([]); // Ensure initial state is an empty array
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Function to fetch user information
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/profile/user/${id}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    // Function to fetch scholarship programs
    const fetchScholarships = async () => {
      try {
        const response = await fetch(`/api/profile/${id}/scholarship-programs`);
        const data = await response.json();
        setScholarships(Array.isArray(data) ? data : []); // Ensure data is an array
      } catch (error) {
        console.error('Error fetching scholarships:', error);
        setScholarships([]); // Set to empty array on error
      }
    };

    // Function to fetch forum posts by user ID
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/profile/forum-posts/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : []); // Ensure data is an array
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]); // Set to empty array on error
      }
    };

    fetchUser();
    fetchScholarships();
    fetchPosts();
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className='flex-grow bg-[#f8f8fb] no-scrollbar font-medium'>
        <div className='border-b mb-8 py-8'>
          <div className='flex flex-row items-center mx-auto max-w-6xl gap-10 px-24'>
            <img
              src={user.profilePicture}
              alt="Profile"
              className='w-36 h-36 my-8 rounded-md object-cover'
            />
            <div className='flex flex-col items-start gap-2 w-1/2 '>
              <span className='text-xl font-medium text-gray-600'>Organization</span>
              <span className='text-4xl font-bold text-gray-800'>
                {user.scholarshipProviderDetails.organizationName || 'Organization Name'}
              </span>
              <span className='text-xl font-medium text-gray-600'>Followers: {user.followers}</span>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-4 max-w-6xl px-24 mx-auto'>
          <div className='flex flex-row gap-4 justify-between font-semibold mb-6'>
            <button
              className={`border text-center rounded-xl w-1/2 px-16 py-4 ${selectedTab === 'About' ? 'bg-white shadow-md' : 'bg-slate-200 hover:bg-slate-300'}`}
              onClick={() => handleTabClick('About')}
            >
              About
            </button>
            <button
              className={`border text-center rounded-xl w-1/2 px-16 py-4 ${selectedTab === 'Scholarships' ? 'bg-white shadow-md' : 'bg-slate-200 hover:bg-slate-300'}`}
              onClick={() => handleTabClick('Scholarships')}
            >
              Scholarships
            </button>
            <button
              className={`border text-center rounded-xl w-1/2 px-16 py-4 ${selectedTab === 'Posts' ? 'bg-white shadow-md' : 'bg-slate-200 hover:bg-slate-300'}`}
              onClick={() => handleTabClick('Posts')}
            >
              Posts
            </button>
          </div>

          {selectedTab === 'About' && (
            <div className='border-2 rounded-md p-10 flex flex-col bg-white h-auto mb-20'>
              <h2 className='text-2xl font-bold mb-4'>About the Scholarship Provider</h2>
              <p className='mb-4'>
                The Department of Education (DepEd) is committed to promoting quality education for all Filipino students. As part of this mission, DepEd offers various scholarship programs to support students in achieving their academic and career goals.
              </p>
              <h3 className='text-xl font-semibold mb-2'>Our Mission</h3>
              <p className='mb-4'>
                Our mission is to ensure that every Filipino child has access to quality education, regardless of their socio-economic background. We believe that education is a powerful tool for personal and national development.
              </p>
              <h3 className='text-xl font-semibold mb-2'>Our Vision</h3>
              <p className='mb-4'>
                We envision a nation where every student is equipped with the knowledge, skills, and values needed to thrive in a rapidly changing world. Through our scholarship programs, we aim to nurture future leaders and innovators.
              </p>
              <h3 className='text-xl font-semibold mb-2'>Our Programs</h3>
              <p className='mb-4'>
                DepEd offers a range of scholarship programs designed to support students at different levels of education. These programs provide financial assistance, mentorship, and opportunities for personal and professional growth.
              </p>
              <h3 className='text-xl font-semibold mb-2'>Contact Us</h3>
              <p className='mb-4'>
                For more information about our scholarship programs, please visit our website or contact our support team at:
              </p>
              <ul className='list-disc list-inside mb-4'>
                <li>Email: scholarships@deped.gov.ph</li>
                <li>Phone: (02) 123-4567</li>
                <li>Address: DepEd Complex, Meralco Avenue, Pasig City, Philippines</li>
              </ul>
            </div>
          )}

          {selectedTab === 'Scholarships' && (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700'>
              {scholarships.length === 0 ? (
                <p>No scholarship programs available.</p>
              ) : (
                scholarships.map((scholarship) => (
                  <div key={scholarship.id} className='border bg-white rounded-lg pt-4 px-4 shadow-sm gap-2 mb-20 hover:-translate-y-1 transition ease-in-out'>
                    <div className='flex flex-row mt-4 px-4 gap-10'>
                      <img src={scholarship.scholarshipImage} alt="Scholarship Image" className='rounded-full w-16 h-16 object-cover' />
                      <div className='flex flex-col'>
                        <div className='font-bold'>{scholarship.organizationName}</div>
                        <h2 className='text-xl font-semibold'>{scholarship.title}</h2>
                      </div>
                    </div>

                    <div className='p-4 flex flex-col gap-2'>
                      <div className='mt-4'>
                        <div className='border-b-2'></div>
                        <div className='-translate-y-4'>
                          <div className='flex text-blue-600 text-center justify-center font-bold'>
                            <div className='flex flex-row bg-white gap-2 px-2'>
                              <FaHandHolding className='text-xl' />
                              {scholarship.amount}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='flex flex-col gap-4'>
                        <div className='flex flex-row gap-4'>
                          <div className='flex flex-row w-40'>
                            <FaInfoCircle className='text-2xl text-blue-600 w-10' />
                            <p className='font-medium'>Info: </p>
                          </div>
                          <p className='w-full text-sm'>{scholarship.description}</p>
                        </div>

                        <div className='flex flex-row gap-4'>
                          <div className='flex flex-row w-40'>
                            <FaInfoCircle className='text-2xl text-blue-600 w-10' />
                            <p className='font-medium'>Eligibility: </p>
                          </div>
                          <p className='w-full text-sm'>{scholarship.otherEligibility}</p>
                        </div>

                        <div className='flex flex-row gap-4'>
                          <div className='flex flex-row w-40'>
                            <FaInfoCircle className='text-2xl text-blue-600 w-10' />
                            <p className='font-medium'>Deadline: </p>
                          </div>
                          <p className='w-full text-md'>
                            {new Date(scholarship.applicationDeadline).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <Link to='/application-details' className='bg-blue-600 text-white p-2 flex justify-center items-center rounded-md my-4 font-medium hover:bg-blue-800 transition ease-in-out'>
                        More Details for Application
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {selectedTab === 'Posts' && (
            <div className='grid grid-cols-3 sm:grid-rows-1 gap-8 pb-12'>
              {posts.length === 0 ? (
                <p>No posts available.</p>
              ) : (
                posts.map((post) => (
                  <Link to={`/forums/post/${post._id}`} key={post.id} className='bg-white font-normal border p-4 rounded-md flex flex-col hover:-translate-y-1 hover:shadow-lg transition ease-in-out'>
                    <h2 className='text-xl font-semibold mb-2'>{post.title}</h2>
                    {post.content}
                    <span className='text-sm flex items-end justify-end w-full text-slate-600'>Posted: {new Date(post.createdAt).toLocaleDateString()}</span>

                    <div className='border-t mt-2'>
                      <div className='flex flex-row justify-between mt-2 gap-2'>
                        <div className='flex flex-row gap-2'>
                          <div className='flex flex-row gap-1 px-2'>
                            <FaRegHeart className='w-6 h-6 font-bold text-blue-600' />
                            <span>{post.likes}</span>
                          </div>

                          <div className='flex flex-row gap-1'>
                            <BiCommentDots className='w-6 h-6 text-blue-600' />
                            <span>{post.comments}</span>
                          </div>
                        </div>

                        <div className='flex flex-row gap-1 pr-2'>
                          <FaRegEye className='w-6 h-6 text-blue-600' />
                          <span>{post.views}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}