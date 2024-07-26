import React, { useState } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaHandHolding } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { BiCommentDots } from "react-icons/bi";
import { FaRegEye } from "react-icons/fa";
import { Link } from 'react-router-dom';

export default function ProfilePreview() {
  const [selectedTab, setSelectedTab] = useState('About');

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const scholarships = [
    {
      id: 1,
      title: 'Engineering Excellence Scholarship',
      description: 'A scholarship for outstanding undergraduate engineering students.',
      eligibility: 'Undergraduate students in an accredited engineering program.',
      deadline: 'December 31, 2023',
    },
    {
      id: 2,
      title: 'Future Leaders in Medicine Scholarship',
      description: 'Supporting the next generation of medical professionals.',
      eligibility: 'First-year medical students with a passion for community service.',
      deadline: 'November 15, 2023',
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className='flex-grow bg-[#f8f8fb] no-scrollbar font-medium'>
        <div className='border-b mb-8 py-8'>
          <div className='flex flex-row items-center mx-auto max-w-6xl gap-10 px-24'>
            <div className='bg-blue-600 w-36 h-36 my-8 rounded-md'></div>
            <div className='flex flex-col items-start gap-2 w-1/2 '>
              <span className='text-xl font-medium text-gray-600'>Organization</span>
              <span className='text-4xl font-bold text-gray-800'>DepEd</span>
              <span className='text-xl font-medium text-gray-600'>Followers: N</span>
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
            <div className='border-2 rounded-md p-10 flex justify-center items-center bg-white h-96 mb-20'>
              <span>Container for About</span>
            </div>
          )}
          {selectedTab === 'Scholarships' && (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700'>
            {scholarships.map((scholarship) => (
              <div key={scholarship.id} className='border bg-white rounded-lg pt-4 px-4 shadow-sm gap-2 mb-20 hover:-translate-y-1 transition ease-in-out'>
                <div className='flex flex-row justify-between mt-4 px-4 gap-10'>
                  <div className='bg-blue-600 rounded-full w-24 h-auto'></div>
                  <div className='flex flex-col'>
                  <div className='font-bold '>DepEd</div>
                <h2 className='text-xl font-semibold'>{scholarship.title}</h2>
                </div>
                </div>

                <div className='p-4 flex flex-col gap-2'>

                <div className='mt-4'>
                <div className='border-b-2'></div>
                      <div className='-translate-y-4'>
                            <div className='flex text-blue-600 text-center justify-center font-bold'>
                                        <div className='flex flex-row bg-white gap-2 px-2'>
                                      <FaHandHolding className='text-xl'/>
                                      Php 80,000 - Php 100,000
                                        </div>
                            </div>
                      </div>
                </div>


                <div className='flex flex-col gap-4'>
                <div className='flex flex-row gap-4'>
                  <div className='flex flex-row w-40'>
                <FaInfoCircle className='text-2xl text-blue-600 w-10'/>
                <p className='font-medium'>Info: </p>
                </div>
                <p className='w-full text-sm'>{scholarship.description}</p>
                </div>

                <div className='flex flex-row gap-4'>
                  <div className='flex flex-row w-40'>
                <FaInfoCircle className='text-2xl text-blue-600 w-10'/>
                <p className='font-medium'>Eligibility: </p>
                </div>
                <p className='w-full text-sm'>{scholarship.eligibility}</p>
                </div>
                      
                <div className='flex flex-row gap-4'>
                  <div className='flex flex-row w-40'>
                <FaInfoCircle className='text-2xl text-blue-600 w-10'/>
                <p className='font-medium'>Deadline: </p>
                </div>
                <p className='w-full text-md'>{scholarship.deadline}</p>
                </div>
                </div>

               
                  <Link to='/application-details' className='bg-blue-600 text-white p-2 flex justify-center items-center rounded-md my-4 font-medium
                  hover:bg-blue-800 transition ease-in-out'>
                  
                    More Details for Application
                  </Link>
               


                </div>
              </div>
            ))}
          </div>
          )}

          {selectedTab === 'Posts' && (
               <div className='grid grid-cols-3 sm:grid-rows-1 gap-8'>
               <div className='bg-white font-normal border p-4 rounded-md flex flex-col hover:-translate-y-1 hover:shadow-lg transition ease-in-out'>
                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, vel.
                 <span className='text-sm flex items-end justify-end w-full text-slate-600'>Posted: July 7,2024</span>

                 <div className='border-t mt-2'>
                 <div className='flex flex-row justify-between mt-2 gap-2'>


                 <div className='flex flex-row gap-2'>
                 <div className='flex flex-row gap-1 px-2'>
                 <FaRegHeart  className='w-6 h-6 font-bold text-blue-600' />
                 <span>123</span>
                 </div>

                 <div className='flex flex-row gap-1'>
                 <BiCommentDots  className='w-6 h-6 text-blue-600' />
                 <span>10</span>
                 </div>
                 </div>

                 <div className='flex flex-row gap-1 pr-2'>
                 <FaRegEye className='w-6 h-6 text-blue-600' />
                 <span>1.2k</span>
                 </div>

                 </div>
                 </div>
               </div>
       
             </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}