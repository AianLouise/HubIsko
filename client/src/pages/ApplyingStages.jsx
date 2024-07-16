import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaArrowRightLong } from "react-icons/fa6";



export default function ApplyingStages() {

    return(
        <div className='flex flex-col min-h-screen'>
           <Header />
                <main className='flex-grow font-medium text-slate-700'>
                        <div className='flex flex-col mx-auto max-w-6xl px-24'>

                        <div className='flex justify-center items-center gap-4 mt-20'>
                        <div className='flex flex-col gap-1 items-center text-center'>
                            <span className='text-xl font-bold text-blue-600'>1</span>
                            <div className='bg-blue-600 h-24 w-24 rounded-md'></div>
                            <span>Basic <br/> Information</span>
                        </div>

                        <FaArrowRightLong className='text-4xl text-blue-600'/>

                        <div className='flex flex-col gap-1 items-center text-center'>
                            <span className='text-xl font-bold text-blue-600'>2</span>
                            <div className='bg-blue-600 h-24 w-24 rounded-md'></div>
                            <span>Parental <br/> Information</span>
                        </div>

                        <FaArrowRightLong className='text-4xl text-blue-600'/>

                        <div className='flex flex-col gap-1 items-center text-center'>
                            <span className='text-xl font-bold text-blue-600'>3</span>
                            <div className='bg-blue-600 h-24 w-24 rounded-md'></div>
                            <span>School <br/> Information</span>
                        </div>

                        <FaArrowRightLong className='text-4xl text-blue-600'/>
                        <div className='flex flex-col gap-1 items-center text-center'>
                            <span className='text-xl font-bold text-blue-600'>4</span>
                            <div className='bg-blue-600 h-24 w-24 rounded-md'></div>
                            <span>Student <br/> Information</span>
                        </div>

                        <FaArrowRightLong className='text-4xl text-blue-600'/>
                        <div className='flex flex-col gap-1 items-center text-center'>
                            <span className='text-xl font-bold text-blue-600'>5</span>
                            <div className='bg-blue-600 h-24 w-24 rounded-md'></div>
                            <span>Documents <br/> upload</span>
                        </div>

                        <FaArrowRightLong className='text-4xl text-blue-600'/>
                        <div className='flex flex-col gap-1 items-center text-center'>
                            <span className='text-xl font-bold text-blue-600'>6</span>
                            <div className='bg-blue-600 h-24 w-24 rounded-md'></div>
                            <span>Terms and <br/> Agreement</span>
                        </div>
                        </div>


                        <div className='border shadow bg-white w-full h-[500px] my-16 rounded-md'>

                        </div>
                        </div>
                </main>
           <Footer />
        </div>
    )
}