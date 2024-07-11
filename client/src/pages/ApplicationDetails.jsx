import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaHandHolding } from "react-icons/fa6";
import { FaRegCalendarXmark } from "react-icons/fa6";
import { MdOutlineRefresh } from "react-icons/md";
import { BsGlobe2 } from "react-icons/bs";
import { FaArrowRightLong } from "react-icons/fa6";


export default function Forums() {

return(
    <div className='min-h-screen flex flex-col'>
    <Header />
    <main className='flex-grow bg-[#f8f8fb] font-medium'>
    <div className='border-b mb-8 py-8'>
          <div className='flex flex-row items-center mx-auto max-w-6xl gap-10 px-24'>
          <div className='bg-blue-600 w-36 h-36 my-8 rounded-md'></div>
            <div className='flex flex-col gap-2 w-1/2'>
            <div className='flex flex-row divide-x-2 divide-blue-200 mb-2'>
            <span className='text-2xl font-bold text-gray-600 pr-4'>DepEd</span>
            <span className='text-2xl font-medium text-gray-400 pl-4'>July 20, 2021</span>
            </div>
            <h1 className='text-4xl font-bold text-gray-800'>Scholarship Title</h1>
          
            <div className='flex text-blue-600 font-bold'>
                  <div className='flex flex-row gap-2 px-2 text-xl'>
                         <FaHandHolding className=''/>
                             Php 80,000 - Php 100,000
                    </div>
            </div>
            </div>
          </div>
    </div>


    <div className='max-w-6xl px-24 mx-auto mb-20'>
        <div className='flex gap-2'>
            <span className='flex gap-1 bg-white border px-4 py-2 rounded-md shadow'>
            <MdOutlineRefresh className='w-6 h-6 text-blue-600'/>
                Last update: July 2, 2024
            </span>
            <span className='flex gap-2 bg-white border px-4 py-2 rounded-md shadow items-center'> 
            <FaRegCalendarXmark className='text-red-500' />
            Deadline: July 30, 2024</span>
        </div>
            <div className='flex justify-center items-center w-full h-52 rounded-md my-4 shadow border'>
                Scholarship Banner
            </div>
        
            <div className='flex flex-col gap-2 mt-8 border rounded-md bg-white'>
                <span className='font-bold text-xl text-white bg-blue-600 p-4 rounded-t-md'>What is this scholarship for?</span>
                <span className='text-sm p-4'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quo unde aliquid assumenda blanditiis, voluptatem qui! Sed quidem fugiat ut voluptatem, ex minima vero veritatis deleniti, quas illo recusandae eveniet pariatur voluptatum cupiditate assumenda ipsam, praesentium dolorum minus voluptatibus placeat quod?</span>
            </div>

            <div className='flex flex-col gap-2 mt-8 border rounded-md bg-white'>
                <span className='font-bold text-xl text-white bg-blue-600 p-4 rounded-t-md'>What are the benefits?</span>
                <span className='text-sm p-4'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quo unde aliquid assumenda blanditiis, voluptatem qui! Sed quidem fugiat ut voluptatem, ex minima vero veritatis deleniti, quas illo recusandae eveniet pariatur voluptatum cupiditate assumenda ipsam, praesentium dolorum minus voluptatibus placeat quod?</span>
            </div>

            <div className='flex flex-col gap-2 mt-8 border rounded-md bg-white'>
                <span className='font-bold text-xl text-white bg-blue-600 p-4 rounded-t-md'>What are the qualifications?</span>
                <span className='text-sm p-4'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quo unde aliquid assumenda blanditiis, voluptatem qui! Sed quidem fugiat ut voluptatem, ex minima vero veritatis deleniti, quas illo recusandae eveniet pariatur voluptatum cupiditate assumenda ipsam, praesentium dolorum minus voluptatibus placeat quod?</span>
            </div>

            <div className='flex flex-col gap-2 mt-8 border rounded-md bg-white'>
                <span className='font-bold text-xl text-white bg-blue-600 p-4 rounded-t-md'>How can I apply?</span>
                <span className='text-sm p-4'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quo unde aliquid assumenda blanditiis, voluptatem qui! Sed quidem fugiat ut voluptatem, ex minima vero veritatis deleniti, quas illo recusandae eveniet pariatur voluptatum cupiditate assumenda ipsam, praesentium dolorum minus voluptatibus placeat quod?</span>
            </div>

            <div className='flex flex-col gap-2 mt-8 border rounded-md bg-white'>
                <span className='font-bold text-xl text-white bg-blue-600 p-4 rounded-t-md'>What documents should I prepare?</span>
                <span className='text-sm p-4'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quo unde aliquid assumenda blanditiis, voluptatem qui! Sed quidem fugiat ut voluptatem, ex minima vero veritatis deleniti, quas illo recusandae eveniet pariatur voluptatum cupiditate assumenda ipsam, praesentium dolorum minus voluptatibus placeat quod?</span>
            </div>

            <div className='flex flex-col gap-2 mt-8 border rounded-md bg-white'>
                <span className='font-bold text-xl text-white bg-blue-600 p-4 rounded-t-md'>Frequently Asked Questions</span>
                <span className='text-sm p-4'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quo unde aliquid assumenda blanditiis, voluptatem qui! Sed quidem fugiat ut voluptatem, ex minima vero veritatis deleniti, quas illo recusandae eveniet pariatur voluptatum cupiditate assumenda ipsam, praesentium dolorum minus voluptatibus placeat quod?</span>
              
              <div className='border mx-8'></div>
              <div className='items-center justify-center flex -translate-y-5'>
                <span className='bg-white px-8 text-slate-500'>Do you have more questions?</span>
              </div>
              
                <div className='flex gap-6 justify-center mb-8'>
                    <button className='bg-white border flex flex-row p-4 gap-2 rounded-md hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out'>
                        <div className='bg-blue-600 w-12 h-12 rounded-md'></div>
                        <div className='flex flex-col justify-center'>
                        <span className='text-slate-600 text-left'>Email Us!</span>
                        <span className=''>example@email.com</span>
                        </div>
                    </button>

                    <button className='bg-white border flex flex-row p-4 gap-2 rounded-md hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out'>
                        <div className='bg-blue-600 w-12 h-12 rounded-md'></div>
                        <div className='flex flex-col justify-center'>
                        <span className='text-slate-600 text-left'>Call us!</span>
                        <span className=''>+63 9123456789</span>
                        </div>
                    </button>

                    <button className='bg-white border flex flex-row p-4 gap-2 rounded-md hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out'>
                        <div className='bg-blue-600 w-12 h-12 rounded-md'></div>
                        <div className='flex flex-col justify-center text-left'>
                        <span className='text-slate-600 '>Visit our profile!</span>
                        <span className=''>DepEd</span>
                        </div>
                    </button>

                </div>
            </div>

            <div className='flex flex-col items-center justify-center border-t my-10'>
                <span className='font-bold text-slate-700 py-8 text-2xl'>Ready to Apply?</span>
                <div className='flex gap-4 w-full'>
                    <button className='bg-white flex border justify-between items-center shadow rounded-md p-4 w-1/2 h-22 hover:-translate-y-2 hover:bg-slate-200 transition ease-in-out group'>
                         <div className='flex flex-row gap-4 '>
                        <div className='bg-blue-600 w-14 h-14 rounded-md'></div>
                        <div className='flex flex-col text-left'>
                        <span className='text-lg text-left'>Apply in Organization's website!</span>
                        <span className='text-slate-600'>They'll offer more information!</span>
                        </div>
                        </div>
                    <BsGlobe2 className='w-8 h-8 ml-4 group-hover:w-12 group-hover:h-12 group-hover:text-blue-600 transition-all ease-in-out'/>
                        
                    </button>

                    <button className='bg-white flex items-center border justify-between shadow rounded-md p-4 w-1/2 h-22 hover:-translate-y-2 hover:bg-slate-200 transition ease-in-out group'>
                        <div className='flex flex-row gap-4 '>
                        <div className='bg-blue-600 w-14 h-14 rounded-md'></div>
                        <div className='flex flex-col text-left'>
                        <span className='text-lg'>Apply now in Hubisko!</span>
                        <span className='text-slate-600'>We'll guide you step by step!</span>
                        </div>
                        </div>
                        
                        <FaArrowRightLong className='w-8 h-8 mr-4 group-hover:translate-x-2 group-hover:text-blue-600 transition ease-in-out'/>
                        
                    </button>
                </div>
            </div>
    </div>

    </main>
    <Footer />
    </div>

);

}