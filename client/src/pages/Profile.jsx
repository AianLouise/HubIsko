import {React, useState, useEffect} from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AccountManagement from "./AccountManagement";
import { RiEditFill } from "react-icons/ri";
import { CgClose } from "react-icons/cg";
import { FaRegHeart } from "react-icons/fa";
import { BiCommentDots } from "react-icons/bi";
import { FaRegEye } from "react-icons/fa";
import { BiPlus } from "react-icons/bi";

export default function Profile() {

const [ShowModal, setShowModal] = useState(false);
const [ShowModal2, setShowModal2] = useState(false);
const [selectedTab, setSelectedTab] = useState('About');


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



 return(
  <div className="flex flex-col min-h-screen">
    <Header />
    <AccountManagement />
    <main className="flex-grow bg-[#f8f8fb]">
    <div className='border-b mb-8 py-8'>
          <div className='flex flex-col lg:flex-row items-center mx-auto max-w-6xl gap-4 lg:gap-10 px-4 lg:px-24'>
            <div className='bg-blue-600 w-36 h-36 my-8 rounded-md border-blue-800 hover:border-4 hover:cursor-pointer'></div>
            <div className='flex flex-col items-center lg:items-start gap-2 w-full lg:w-1/2'>
              <span className='text-xl font-medium text-gray-600'>Student</span>
              <div className="flex gap-4 items-center group">
              <button onClick={handleModal} className='text-4xl font-bold text-gray-800 border-blue-600 border-2 lg:bg-slate-200 px-4 py-2 rounded-md hover:bg-slate-300 cursor-pointer transition ease-in-out'>Name: Name</button>
              <span className="text-2xl hidden lg:hidden lg:group-hover:flex items-center gap-2 font-bold text-blue-600 group-hover:text-blue-600 transition ease-in-out" >
              <RiEditFill className="w-8 h-8" />
                <span>Click to Edit</span>
              </span>
              </div>
              <span className='text-xl font-medium text-gray-600'>Followers:</span>
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
            <input type="text" placeholder="Search Posts" className="border-2 border-slate-500 rounded-md py-4 px-6 lg:px-0 lg:p-2 w-full lg:w-[300px]" />
          </div>

          </div>
    
              <div className='w-full flex justify-center border-t-2 mt-14'>
              <span className='text-2xl bg-[#f8f8fb] -translate-y-5 px-8 font-medium text-slate-500'>Your Forum Posts</span>
            </div>

              <div className='grid lg:grid-cols-3 grid-rows-1 gap-8'>
              <div className='bg-white border p-4 rounded-md flex flex-col hover:-translate-y-1 hover:shadow-lg transition ease-in-out'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, vel.
                <span className='text-sm flex items-end justify-end w-full text-slate-600'>Posted: July 7,2024</span>
                <div className='border-t mt-2'>
                  <div className='flex flex-row justify-between mt-2 gap-2'>
                    <div className='flex flex-row gap-2'>
                      <div className='flex flex-row gap-1 px-2'>
                        <FaRegHeart className='w-6 h-6 font-bold text-blue-600' />
                        <span>123</span>
                      </div>
                      <div className='flex flex-row gap-1'>
                        <BiCommentDots className='w-6 h-6 text-blue-600' />
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
            <CgClose onClick={handleCloseModal}/>
            </button>
          </div>
          
          <form className='flex flex-col'>
            <label htmlFor='name' className='font-semibold text-gray-600'>Name</label>
            <input type='text' id='name' className='border rounded-md p-2 mb-4' />
            <button type='submit' className='bg-blue-600 text-white font-semibold rounded-md py-2'>Save</button>
          </form>
        </div>
      </div>
    )}

    {ShowModal2 && (
      <div className='fixed z-20 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center'>
        <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
          <div className="flex flex-row items-center justify-between mb-4">
            <h2 className='text-2xl font-bold'>Create a Post</h2>
            <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-800">
            <CgClose onClick={handleCloseModal2}/>
            </button>
          </div>
          
          <form className='flex flex-col'>
            <label htmlFor='title' className='font-semibold text-gray-600'>Title</label>
            <input type='text' id='title' className='border rounded-md p-2 mb-4' />
            <label htmlFor='content' className='font-semibold text-gray-600'>Content</label>
            <textarea id='content' className='border rounded-md p-2 mb-4' />
            <button type='submit' className='bg-blue-600 text-white font-semibold rounded-md py-2'>Create Post</button>
          </form>
        </div>
      </div>

    )}

    


      

  </div>


 );
}