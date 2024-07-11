  import React from 'react'
  import Header from '../components/Header'
  import Footer from '../components/Footer'
  import { FaSearch } from "react-icons/fa";
  import { FaRedo } from "react-icons/fa";
  import { FaHandHolding } from "react-icons/fa6";
  import { FaInfoCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';





  export default function ScholarshipListing() {
    // Sample scholarship data
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
      <div className="flex flex-col min-h-screen"> {/* Wrap content in a flex container */}
        <Header />
        <main className="flex-grow bg-[#f8f8fb]"> {/* Main content area */}
          <div className='border-b mb-8 py-8'>
          <div className='flex items-center mx-auto max-w-6xl justify-between px-24'>
            <div className='flex flex-col gap-2 w-1/2'>
            <h1 className='w-1/2 text-4xl font-bold text-gray-800'>Available <br/> Scholarships</h1>
            <p className='w-1/2 text-lg text-slate-500 font-medium'>Browse them below!</p>
            </div>


          <div className='bg-blue-600 w-36 h-36 my-8 rounded-md'></div>
          </div>
          </div>
          

    
          
          <div className='flex flex-col mx-auto max-w-6xl justify-center items-center px-24'>
            <div className='flex flex-row w-full items-center gap-4'>
              <input 
              type="text" 
              placeholder='Search' 
              name="" 
              id="" 
              className='border-2 mb-8 p-2 px-6 text-lg font-medium rounded-md focus:outline-blue-400'/>
              
              <button className='flex items-center justify-center bg-white p-2 rounded-full mb-6 border-2 hover:bg-slate-200 group'>
              <FaRedo className='w-5 h-5 text-blue-600 group-hover:rotate-180 transition ease-in-out'/>
              </button>
              
            </div>

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
          </div>
        </main>
        <Footer />
      </div>
    )
  }