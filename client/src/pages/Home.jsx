import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { FaAngleRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


<style>

</style>

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen"> {/* Flex container */}
      <Header />
      <main className="flex-grow bg-[#f8f8fb] no-scrollbar"> {/* Main content grows to fill available space */}
        <div className=''>
          <div className='text-center px-56 py-20'>
            <h1 className='text-8xl font-bold text-slate-800 px-20'>
              Explore Scholarships through <span className='text-blue-600'>technology.</span>
            </h1>
            <h4 className='pt-10 text-2xl font-medium text-slate-700'>
              A scholarship management system for your locale!
            </h4>
            <div className='mt-8 flex gap-4 justify-center'>



            {/* For Unregistered */}
            <div className='hidden'>
              <Link to="/register" className='inline-block'>
                <button className='border bg-blue-600 text-white p-4 text-md font-semibold rounded-full hover:bg-blue-700 transition-colors'>
                  Sign Up for Free
                </button>
              </Link>
              <button className='group flex items-center border p-4 text-md font-semibold rounded-full hover:bg-slate-200 transition-all ease-in-out bg-white '>Visit our Forums <FaAngleRight className='group-hover:translate-x-2 group-hover:bg-blue-600 text-xl ml-2 bg-slate-400 text-white rounded-full transition ease-in-out' /></button>
          </div>



            {/* For Registered */}
             <Link to="/register" className='inline-block'>
                <button className='border bg-blue-600 text-white p-4 text-md font-semibold rounded-full hover:bg-blue-700 transition-colors'>
                  View Scholarships
                </button>
              </Link>
              <button className='group flex items-center border p-4 text-md font-semibold rounded-full hover:bg-slate-200 transition-all ease-in-out bg-white '>Visit our Forums <FaAngleRight className='group-hover:translate-x-2 group-hover:bg-blue-600 text-xl ml-2 bg-slate-400 text-white rounded-full transition ease-in-out' /></button>


            </div>
          </div>
        </div>
        <div className='px-4 max-w-6xl mx-auto'>
          <div className='border shadow-2xl rounded-md mb-40 w-6xl transition-all hover:-translate-y-2 bg-white'>
            <h1 className='bg-blue-600 p-4 text-white font-bold text-2xl rounded-t-md'>Our Goal</h1>
            <p className='mb-4 text-slate-700 p-8 font-medium'>
              Our comprehensive scholarship management system is designed to streamline
              the process of finding, applying for, and managing scholarships. Whether
              you're a student seeking financial assistance or an organization looking
              to provide scholarships, our platform offers a suite of tools to simplify
              your journey.
            </p>
          </div>

          <div className='text-slate-700 w-full mb-40 border-2rounded-md p-4 '>

            <div className='font-bold text-4xl w-full text-center mb-10'>Browse Our Features</div>

            <div className='m-2 flex flex-col justify-between gap-2 items-center text-center'>
              <div className='flex flex-row gap-3 font-semibold mb-6'>
                <button className='border text-center rounded-xl px-16 py-4 bg-slate-200 hover:bg-slate-300 focus:bg-white focus:shadow-md'>Explore Resources</button>
                <button className='border text-center rounded-xl px-16 py-4 bg-slate-200 hover:bg-slate-300 focus:bg-white focus:shadow-md'>Fast Processing</button>
                <button className='border text-center rounded-xl px-16 py-4 bg-slate-200 hover:bg-slate-300 focus:bg-white focus:shadow-md'>Organization Tools</button>
                <button className='border text-center rounded-xl px-16 py-4 bg-slate-200 hover:bg-slate-300 focus:bg-white focus:shadow-md'>Enhanced Security</button>
              </div>

          
                <div className=' rounded-xl w-full h-[600px] shadow-md flex flex-row'>

                  <div className='flex flex-col justify-center text-left w-[800px] px-20 pt-16 pb-32 gap-3'>
                  <FaSearch className='text-6xl text-blue-600 my-4'/>
                  <div className='text-4xl font-bold'>Exploring Resources</div>
                  <div className='text-lg font-medium text-slate-500'>Reliable materials for your learnings!</div>
                  <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi molestiae, aspernatur praesentium sint earum ullam perspiciatis vel fugit temporibus necessitatibus!</span>
                  <div className='flex flex-row'>
                 <Link to="" className='flex flex-row gap-2 text-blue-600 text-xl font-medium pt-4 hover:text-slate-700 group'>
                    Learn More <FaArrowRight className='text-lg mt-1 font-normal group-hover:text-slate-700 group-hover:translate-x-2 transition ease-in-out'/>
                  </Link>
                  </div>
                  </div>


                  <div className='flex justify-center items-center w-1/2'>
                    <div className='bg-blue-600 rounded-md w-1/2 h-64 hover:-translate-y-2 transition ease-in-out'></div>
                  </div>

                  </div>
         

            </div>
          </div>


    {/* BENEFITS */}
          <div className='mb-36 border-b text-slate-700 flex flex-col gap-8 text-center'>

            <div className='pb-2 font-bold text-4xl w-full text-center mb-8'>What we'll provide?</div>

            <div className='flex flex-row gap-8 text-center items-center justify-center text-md font-semibold'>

              <div className='bg-white flex flex-row items-center justify-between w-full border h-96 rounded-md shadow-md hover:-translate-y-2 transition-all p-20'>
                <div className='bg-blue-600 rounded-md w-[350px] h-40 mr-8'></div>
               
                <div className='w-1/2 text-left flex flex-col gap-8'>
                <div className='text-blue-600 text-md font-semibold'>ABUNDANT OPPORTUNITIES</div>
                <span className='font-bold text-4xl'> Maximize your scholarship opportunities with minimal effort </span>

                <div className='flex flex-col text-lg text-slate-600 gap-1'>
                <span className=''>Lorem ipsum dolor sit.</span>
                <span className=''>Lorem ipsum dolor sit.</span>
                <span className=''>Lorem ipsum dolor sit.</span>
                </div>
                </div>
              </div>

            </div>

            <div className='flex flex-row gap-8 text-center items-center justify-center text-md font-semibold'>

            <div className='flex flex-row items-center justify-between w-full h-96 rounded-md hover:-translate-y-2 transition-all p-20'>
           
            <div className='w-1/2 text-left flex flex-col gap-8'>
              <div className='text-blue-600 text-md font-semibold'>AUTOMATE USER-FRIENDLY</div>
              <span className='font-bold text-4xl'> Stay organized with dashboard overviews and timely alerts </span>

              <div className='flex flex-col text-lg text-slate-600 gap-1'>
              <span className=''>Lorem ipsum dolor sit.</span>
              <span className=''>Lorem ipsum dolor sit.</span>
              <span className=''>Lorem ipsum dolor sit.</span>
              </div>
              </div>
              
              <div className='bg-blue-600 rounded-md w-[350px] h-40 mr-8'></div>
            </div>

            </div>

            <div className='flex flex-row gap-8 text-center items-center justify-center text-md font-semibold'>

              <div className='bg-white flex flex-row items-center justify-between w-full border h-96 rounded-md shadow-md hover:-translate-y-2 transition-all p-20'>
                <div className='bg-blue-600 rounded-md w-[350px] h-40 mr-8'></div>
               
                <div className='w-1/2 text-left flex flex-col gap-8'>
                <div className='text-blue-600 text-md font-semibold'>RESPONSIVE SYSTEM AND USERS</div>
                <span className='font-bold text-4xl'> Access a wide network of scholarship providers and applicants </span>

                <div className='flex flex-col text-lg text-slate-600 gap-1'>
                <span className=''>Lorem ipsum dolor sit.</span>
                <span className=''>Lorem ipsum dolor sit.</span>
                <span className=''>Lorem ipsum dolor sit.</span>
                </div>
                </div>
              </div>

            </div>

            <div className='flex flex-row gap-8 text-center items-center justify-center text-md font-semibold'>

            <div className='flex flex-row items-center justify-between w-full h-96 rounded-md hover:-translate-y-2 transition-all p-20'>
           
            <div className='w-1/2 text-left flex flex-col gap-8'>
              <div className='text-blue-600 text-md font-semibold'>STEP BY STEP PROCESS</div>
              <span className='font-bold text-4xl'> Get support from our dedicated team every step of the way. </span>

              <div className='flex flex-col text-lg text-slate-600 gap-1'>
              <span className=''>Lorem ipsum dolor sit.</span>
              <span className=''>Lorem ipsum dolor sit.</span>
              <span className=''>Lorem ipsum dolor sit.</span>
              </div>
              </div>
              
              <div className='bg-blue-600 rounded-md w-[350px] h-40 mr-8'></div>
            </div>

            </div>

          </div>


{/* APPLY FOR ROLE */}
            <div className='flex justify-center text-4xl font-bold text-slate-700 pb-10'>Apply now!</div>
          <div className='flex flex-row gap-10 border text-center p-10 rounded-md shadow-inner mb-10'>

          <div className='mb-4 text-slate-700 flex flex-col text-center justify-center border border-b w-1/2 bg-white p-10'>
            <div className='text-left'>
              <div className='pb-4 font-bold text-xl'>Ready to take the next step in your educational journey?
              </div>
              <p className='text-lg text-slate-500 font-medium'>Join us! It's completely free!</p>
              <div className='flex flex-row justify-between items-center'>
                <div className='border rounded-full italic pl-4 p-1 mt-4 text-left bg-[#f8f8fb] font-medium text-slate-400'>
                  <div className='flex flex-row gap-10 text-center items-center'>
                    <div>Enter your email</div>
                    <div className='bg-blue-600 text-white p-2 rounded-full px-4 flex flex-row items-center gap-2'>forums <FaAngleRight /></div>
                  </div>
                </div>
                <div className='bg-blue-600 w-24 h-20 rounded-md'></div>
              </div>
            </div>
          </div>

          

          <div className='mb-4 text-slate-700 flex flex-col text-center justify-center border border-b w-1/2 bg-white p-10'>
            <div className='text-left'>
              <div className='pb-4 font-bold text-xl'>Are you looking to provide scholarships to deserving students?
              </div>
              <p className='text-lg text-slate-500 font-medium '>We're looking to help you!</p>
              <div className='flex flex-row justify-between items-center'>
                <div className='border rounded-full italic pl-4 p-1 mt-4 text-left bg-[#f8f8fb] font-medium text-slate-400'>
                  <div className='flex flex-row gap-10 text-center items-center'>
                    <div>Enter your email</div>
                    <div className='bg-blue-600 text-white p-2 rounded-full px-4 flex flex-row items-center gap-2'>forums<FaAngleRight /></div>
                  </div>
                </div>
                <div className='bg-blue-600 w-24 h-20 rounded-md'></div>
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