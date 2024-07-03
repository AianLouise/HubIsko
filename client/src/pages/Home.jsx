import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { FaAngleRight } from "react-icons/fa";

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
            <button className=' border bg-blue-600 text-white p-3 text-md font-semibold rounded-full hover:bg-blue-700 transition-colors'>Sign Up for Free</button>
            <button className='group flex items-center border p-4 text-md font-semibold rounded-full hover:bg-slate-200 transition-all ease-in-out bg-white '>Visit our Forums <FaAngleRight className='group-hover:translate-x-2 group-hover:bg-blue-600 text-xl ml-2 bg-slate-400 text-white rounded-full transition ease-in-out'/></button>
            </div>
      </div>
      </div>
        <div className='px-4 max-w-6xl mx-auto'>
          <div className='border shadow-2xl rounded-md mb-20 w-6xl transition-all hover:-translate-y-2 bg-white'> 
            <h1 className='bg-blue-600 p-4 text-white font-bold text-2xl rounded-t-md'>Our Goal</h1>
          <p className='mb-4 text-slate-700 p-8 font-medium'>
            Our comprehensive scholarship management system is designed to streamline
            the process of finding, applying for, and managing scholarships. Whether
            you're a student seeking financial assistance or an organization looking
            to provide scholarships, our platform offers a suite of tools to simplify
            your journey.
          </p>
          </div>

          <div className='text-slate-700 w-full mb-12 border-2 border-blue-300 rounded-md shadow-inner p-4 bg-white'>
            
            <div className='border-b border-blue-300 pb-2 font-bold text-2xl w-full text-center mb-8'>Key Features</div>

            <div className='m-2 flex justify-between gap-2'>
              <div className='flex flex-col gap-3 font-semibold text-left'>
              <button className='border text-left rounded-xl p-4 pr-24 bg-slate-200 focus:bg-white focus:shadow-md'>Explore Resources</button>
              <button className='border text-left rounded-xl p-4 pr-24 bg-slate-200 focus:bg-white focus:shadow-md'>Fast Processing</button>
              <button className='border text-left rounded-xl p-4 pr-24 bg-slate-200 focus:bg-white focus:shadow-md'>Organization Tools</button>
              <button className='border text-left rounded-xl p-4 pr-24 bg-slate-200 focus:bg-white focus:shadow-md'>Enhanced Security</button>
              </div>

              <div className='w-[800px]'>
              <button className='border rounded-xl w-full h-full shadow-md'>Scholarship Discovery</button>
              </div>
            
            </div>
          </div>

          <div className='mb-12 text-slate-700 text-center'>
         
         <div className='border-b pb-2 font-bold text-2xl w-full text-center mb-8'>Benefits</div>

        <div className='flex flex-row gap-8 text-center items-center justify-center '>

          <div className='bg-white flex flex-col items-center w-1/4 border h-64 rounded-md shadow-md hover:-translate-y-2 transition-all'>
            <div className='bg-blue-600 rounded full h-20 w-20 m-10'></div>
          <div>Maximize your scholarship opportunities with minimal effort</div> 
          </div>

          <div className='bg-white flex flex-col items-center w-1/4 border h-64 rounded-md shadow-md hover:-translate-y-2 transition-all'>
            <div className='bg-blue-600 rounded full h-20 w-20 m-10'></div>
          <div>Stay organized with dashboard overviews and timely alerts</div> 
          </div>

          <div className='bg-white flex flex-col items-center w-1/4 border h-64 rounded-md shadow-md hover:-translate-y-2 transition-all'>
            <div className='bg-blue-600 rounded full h-20 w-20 m-10'></div>
          <div>Access a wide network of scholarship providers and applicants.</div> 
          </div>

          <div className='bg-white flex flex-col items-center w-1/4 border h-64 rounded-md shadow-md hover:-translate-y-2 transition-all'>
            <div className='bg-blue-600 rounded full h-20 w-20 m-10'></div>
          <div>Get support from our dedicated team every step of the way.</div> 
          </div>

        </div>

          </div>

          <div className='mb-4 text-slate-700 flex flex-col text-center justify-center border border-b bg-white p-10'>
            <div className='text-left'>
            <div className='pb-2 font-bold text-2xl'>Ready to take the next step in your educational journey?
            </div>
            <p className='text-lg text-slate-500 font-medium '>Join us! It's completely free!</p>
            <div className='flex flex-row justify-between items-center'>
              <div className='border rounded-full italic pl-4 p-1 mt-4 text-left bg-[#f8f8fb] font-medium text-slate-400'>
                <div className='flex flex-row gap-10 text-center items-center'>
                <div>Enter your email</div>
                <div className='bg-blue-600 text-white p-2 rounded-full px-4 flex flex-row items-center gap-2'>forums <FaAngleRight/></div>
                </div>
              </div>
              <div className='bg-blue-600 w-60 h-20 rounded-md'></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}