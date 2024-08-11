import React, {useState} from "react";
import { Link } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";
import { BsPencilFill } from "react-icons/bs";
import { BsTrashFill } from "react-icons/bs";
import { BiCheck } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { BiCommentDots } from "react-icons/bi";
import { FaRegEye } from "react-icons/fa";

export default function ProviderDetails() {

    const [selectedTab, setSelectedTab] = useState('About');

    const handleTabClick = (tab) => {
      setSelectedTab(tab);
    };

    return(
        <div className="flex flex-col min-h-screen font-medium text-slate-700">
        <main className="flex-grow bg-[#f8f8fb] pb-24">

        <div className='max-w-8xl mx-auto px-24 gap-10 flex-col flex mt-16'>

        <div className="flex gap-2 items-center">
                <Link to={'/provider-accounts'} className="border shadow px-6 py-2 bg-white rounded-md hover:bg-slate-200">
                    <span>Scholarship Providers</span>
                </Link>
                <IoMdArrowDropdown className='-rotate-90 w-8 h-8 text-blue-600' />

                <div className="border shadow px-6 py-2 bg-white rounded-md">
                    <span className="text-blue-600">DepEd's Details</span>
                </div>
            </div>
        </div>

        <div className='border-b mb-8'>
                <div className={'flex items-center mx-auto px-24'}>
                    <div className='flex items-center gap-6 w-1/2'>
                    <div className='bg-blue-600 w-36 h-36 my-8 rounded-full'></div>
                    <div className="flex flex-col gap-4">
                    <div className='text-4xl font-bold text-gray-800 flex items-center gap-4'>
                      
                        Organization: DepEd
                        <div className="bg-blue-600 rounded-full">
                        <BiCheck className="w-8 h-8 text-white" />
                        </div>
                        </div>
                    <p className='text-lg text-slate-500 font-medium'>Scholars: N</p>
                    </div>
                    </div>
                </div>
        </div>

        <div className='max-w-8xl mx-auto px-24 gap-10 flex-col flex mt-16'>

        <div className='flex flex-row gap-4 justify-between font-semibold mb-6'>
            <button
              className={`border text-center rounded-xl w-1/2 px-16 py-4 ${selectedTab === 'Student Information' ? 'bg-white shadow-md' : 'bg-slate-200 hover:bg-slate-300'}`}
              onClick={() => handleTabClick('Organization Information')}
            >
              Organization Information
            </button>

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

        
          {selectedTab === 'Organization Information' && (
            <div className='border-2 rounded-md p-10 flex justify-center items-center bg-white h-96 mb-20'>
            <span>Container for Organization</span>
          </div>
              
            )}


        {selectedTab === 'About' && (
            <div className='border-2 rounded-md p-10 flex justify-center items-center bg-white h-96 mb-20'>
              <span>Container for About</span>
            </div>
          )}

        {selectedTab === 'Scholarships' && (
            <div className='border-2 rounded-md p-10 flex justify-center items-center bg-white h-96 mb-20'>
              <span>Container for Student's Scholarships</span>
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
        </div>
    );
}