import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaRegHeart } from "react-icons/fa";
import { BiCommentDots } from "react-icons/bi";
import { FaRegEye } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { useState } from 'react';
import { Link } from 'react-router-dom';



export default function ForumPostDetail() {

  
    const [showDropdown, setShowDropdown] = useState(false);

  
    const toggleDropdown = () => setShowDropdown(!showDropdown);


    return (
        <div className='flex flex-col min-h-screen'>
            <Header />
                <main className='flex-grow bg-[#f8f8fb] no-scrollbar font-medium'>

                    <div className='flex flex-col gap-8 mx-auto max-w-6xl px-24'>
                        
                        <div className='flex gap-1 mt-10 items-center'>
                            <Link to='/Forums'>
                            <button className='bg-white border shadow px-4 py-1 mr-2 rounded-md hover:bg-slate-200 transition ease-in-out'>Forums</button>
                            </Link>
                            <IoMdArrowDropdown className='-rotate-90 text-2xl text-blue-600'/>
                            <button className='bg-white border shadow px-4 py-1 ml-2 rounded-md hover:bg-slate-200 transition ease-in-out'>Post Name</button>
                        </div>
                        <div className='border shadow p-4 rounded-md bg-white'>
                            <div className='flex gap-4'>
                            <div className='bg-blue-600 w-12 h-12 rounded-full'></div>
                            <div className='flex flex-col'>
                            <span className='font-bold text-lg'>HubIsko</span>
                            <span className='text-sm text-gray-500'>June 12, 2021</span>
                            </div>
                            </div>
                            <div className='mt-6 flex flex-col gap-2 pl-2'>
                            <span className='text-left text-3xl font-bold'>This is a post title in testing</span>
                            <span className='text-sm font-normal'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quaerat ducimus consequatur, molestiae porro perspiciatis itaque voluptas labore ipsam. Sapiente debitis amet cum reiciendis maiores necessitatibus nisi illum corrupti, magnam dolor autem consequuntur perspiciatis. Consectetur, architecto! Fugiat itaque maxime numquam fugit?</span>
                            </div>
                            <div className='border-t mt-4'>
                                <div className='flex flex-row justify-between mt-3 gap-2'>


                                <div className='flex flex-row gap-2'>
                                <div className='flex flex-row gap-1 px-2'>
                                <FaRegHeart  className='w-6 h-6 font-bold text-blue-600' />
                                <span>Like</span>
                                </div>

                                <div className='flex flex-row gap-1'>
                                <BiCommentDots  className='w-6 h-6 text-blue-600' />
                                <span>10</span>
                                </div>
                                </div>

                                <div className='flex gap-2'>
                                <div className='flex flex-row gap-1 px-2'>
                                <FaRegHeart  className='w-6 h-6 font-bold text-blue-600' />
                                <span>123</span>
                                </div>
                                <div className='flex flex-row gap-1 pr-2'>
                                <FaRegEye className='w-6 h-6 text-blue-600' />
                                <span>1.2k</span>
                                </div>
                                </div>

                                </div>
                             </div>    
                        </div>


                        <div className='border-t'>
                            <div className='flex gap-2 bg-white border shadow rounded-md mt-4 p-4'>
                             <div className='bg-blue-600 w-16 h-16 rounded-full'></div>
                             <input 
                             type="text"
                             placeholder='Write a reply ...' 
                             className='w-full bg-slate-100 rounded-md px-4 border-2'/>
                            </div>

                            <div onClick={toggleDropdown} className='mt-4 px-4 py-2 border flex bg-white rounded-md w-48 shadow cursor-pointer hover:bg-slate-200 group'>
                               <div className='flex flex-row justify-between w-full'>
                                <div>
                                <span>Sort by: </span>
                                <span>Newest</span>
                                </div>
                                <IoMdArrowDropdown className='w-6 h-6 text-blue-600 group-hover:-rotate-90'/>
                                </div>
                            </div>
                               
                            {showDropdown && (
                                    <div className='absolute w-52 bg-white rounded-md shadow-lg mt-2 py-2 justify-start'>
                                        <button className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full'>Newest</button>
                                        <button className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full'>Oldest</button>
                                        <button className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full'>Most Liked</button>
                                    </div>
                                )    
                                }

                            <div className='flex gap-2 my-8 w-full items-center'>
                             <div className='bg-blue-600 w-12 h-12 rounded-full'></div>
                             <div className='flex flex-col bg-white border rounded-md w-full shadow '>
                                <span className='p-4 text-sm border-b'>This is a test comment</span>

                                <div className='flex flex-row justify-between px-4 py-2 gap-2'>
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
