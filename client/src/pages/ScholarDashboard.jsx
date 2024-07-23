import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { MdModeEdit } from "react-icons/md";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { HiDocumentText } from "react-icons/hi";
import { MdLockOutline } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { BiCommentDots } from "react-icons/bi";
import { FaRegEye } from "react-icons/fa6";



export default function ScholarDashboard() {
  return (
    <div className="flex flex-col min-h-screen"> {/* Flex container */}
      <Header />
      <main className="flex-grow bg-[#f8f8fb]"> {/* Main content grows to fill available space */}
        <div className='py-12 max-w-6xl mx-auto justify-between px-24'>
          {/* <h1 className='text-3xl font-bold mb-4 text-slate-800'>
            Scholar Dashboard
          </h1> */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[350px]">
            {/* Overview of current applications */}

            <div  className="flex flex-col items-center h-[350px] max-h-[350px] bg-white shadow rounded-lg">
        
              <h2 className="font-bold text-xl mb-2 w-full p-4 rounded-t-lg border-b-2">Current Applications</h2>
              <div className='text-8xl mt-20 font-bold text-blue-600'>00</div>
              {/* Application items */}
          
            </div>

            {/* Profile Management */}
            {/* <div className="bg-white shadow rounded-lg col-span-1 md:col-span-2">
              <h2 className="font-semibold text-xl w-full bg-blue-600 p-4 rounded-t-lg text-white">Profile Management</h2>

              <div className="space-y-4 p-4 text-slate-800">
              
                <button className='border-b flex flex-row w-full justify-between p-4 rounded-md hover:bg-slate-200'>
                  <span className='text-lg font-bold'>Edit Personal Details</span>
                  <MdModeEdit className='text-2xl text-blue-600' />
            
                </button>
          
                <button className='border-b flex flex-row w-full justify-between p-4 rounded-md hover:bg-slate-200'>
                  <span className='text-lg font-bold'>Upload Documents</span>
                  <IoDocumentAttachOutline className='text-2xl text-blue-600' />
         
                </button>
      
                <button className='border-b flex flex-row w-full justify-between p-4 rounded-md hover:bg-slate-200'>
                  <span className='text-lg font-bold'>Academic History and GPA</span>
                  <HiDocumentText  className='text-2xl text-blue-600' />
         
                </button>
          
                <button className='flex flex-row w-full justify-between p-4 rounded-md hover:bg-slate-200'>
                  <span className='text-lg font-bold'>Change Password and Security</span>
                  <MdLockOutline   className='text-2xl text-blue-600' />
     
                </button>
              </div>
            </div> */}

            <div className="bg-white shadow rounded-lg col-span-1 md:col-span-2">
            <div className='flex justify-between "font-semibold text-xl w-full bg-blue-600 p-4 rounded-t-lg text-white'>
            <h2 >Application Inbox</h2>
        
            <Link to={`/application-box`}>
            <button className='bg-white text-blue-600 font-bold px-2 rounded-md hover:bg-slate-200'>See all</button>
            </Link>
            </div>

            <div className="space-y-4 p-4 text-slate-800">

              <Link to={`/inboxed-application-detail`}>
              <div className='flex items-center justify-between hover:bg-slate-200 p-2 rounded-md'>
                <div className='flex flex-row gap-2'>
                <div className='bg-blue-600 w-12 h-12 rounded-md'></div>
                <div className='flex flex-col'>
                  <div className='flex items-center gap-2'>
                  <span className='font-bold'>DepEd</span>
                  <div className='bg-blue-600 w-2 h-2 rounded-full'></div>
                  <span className='text-blue-600 text-sm'>New</span>
                  </div>
                  <span>Application Title</span>
                </div>
                </div>
                
               <div className='flex flex-row items-center gap-2'>
                <div className='bg-yellow-400 rounded-full w-2 h-2'></div><span>Pending</span>
               </div>
              </div>
              </Link>

            </div>

              
            </div>
          </div>

          {/* Forum Posts */}
                <div className='w-full flex justify-center border-t-2 mt-14'>  
                <span className='text-2xl bg-[#f8f8fb] -translate-y-5 px-8 font-medium text-slate-500'>Your Forum Posts</span>
                </div>

          {/* POSTS */}
           
                <div className='grid grid-cols-3 sm:grid-rows-1 gap-8'>
                    <div className='bg-white border p-4 rounded-md flex flex-col hover:-translate-y-1 hover:shadow-lg transition ease-in-out'>
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
           
        
        </div>
      </main>
      <Footer />
    </div>
  );
}