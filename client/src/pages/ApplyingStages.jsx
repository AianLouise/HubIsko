import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaArrowRightLong } from "react-icons/fa6";


export default function ApplyingStages() {
    const [activeButtonId, setActiveButtonId] = useState(1);
    const maxButtonId = 4; 

    const handleButtonClick = (buttonId) => {
        setActiveButtonId(buttonId);
    };

    const handleNext = () => {
        setActiveButtonId((prevId) => prevId < maxButtonId ? prevId + 1 : prevId); 
    };

    const handlePrevious = () => {
        setActiveButtonId((prevId) => Math.max(1, prevId - 1)); 
    };

    const getButtonClass = (buttonId) => {
        if (buttonId === activeButtonId) {
            return 'bg-blue-600 w-24 h-24 shadow rounded-md';
        } else {
            return 'w-24 h-24 shadow border rounded-md';
        }
    };

    const getHideorActive = (buttonId) => {
        if (buttonId === activeButtonId) {
            return 'flex flex-col gap-2 border shadow bg-white w-full h-[auto] p-10 my-16 rounded-md';
        } else {
            return 'hidden flex flex-col gap-2 border shadow bg-white w-full h-[auto] p-10 my-16 rounded-md';
        }
    };    

    return (
        <div className='flex flex-col min-h-screen'>
            <Header />
            <main className='flex-grow font-medium text-slate-700'>
                <div className='flex flex-col mx-auto max-w-6xl px-24'>
                    <div className='flex justify-center items-center gap-4 mt-20'>
                        <div className='flex flex-col gap-1 items-center text-center'>
                            <span className='text-xl font-bold text-blue-600'>1</span>
                          
                            <button className={getButtonClass(1)} onClick={() => handleButtonClick(1)}></button>
                            <span>Basic <br /> Information</span>
                        </div>

                        <FaArrowRightLong className='text-4xl text-blue-600' />

                        <div className='flex flex-col gap-1 items-center text-center'>
                            <span className='text-xl font-bold text-blue-600'>2</span>
                     
                            <button className={getButtonClass(2)} onClick={() => handleButtonClick(2)}></button>
                            <span>Personal <br /> Information</span>
                        </div>

                        <FaArrowRightLong className='text-4xl text-blue-600' />

                        
                        <div className='flex flex-col gap-1 items-center text-center'>
                            <span className='text-xl font-bold text-blue-600'>3</span>
                     
                            <button className={getButtonClass(3)} onClick={() => handleButtonClick(3)}></button>
                            <span>Documents <br /> Information</span>
                        </div>

                        <FaArrowRightLong className='text-4xl text-blue-600' />

                        
                        <div className='flex flex-col gap-1 items-center text-center'>
                            <span className='text-xl font-bold text-blue-600'>4</span>
                     
                            <button className={getButtonClass(4)} onClick={() => handleButtonClick(4)}></button>
                            <span>Terms and <br /> Conditions</span>
                        </div>

                    </div>
                
                    <div className={getHideorActive(1)}>
                        <span className='text-lg font-bold '>Basic Information</span>

                        <div className='grid grid-cols-3 gap-2'>
                        <input 
                        type="text" 
                        name=""
                        placeholder='First Name'
                        id="" 
                        className='border-2 p-2 px-6 text-lg font-medium rounded-md focus:outline-blue-400'
                        />

                        <input 
                        type="text" 
                        name=""
                        placeholder='Last Name'
                        id="" 
                        className='border-2 p-2 px-6 text-lg font-medium rounded-md focus:outline-blue-400'
                        />
                        
                        <input 
                        type="text" 
                        name=""
                        placeholder='Middle Name'
                        id="" 
                        className='border-2 p-2 px-6 text-lg font-medium rounded-md focus:outline-blue-400'
                        />  
                        </div>

                        
                      
                        <div className='flex mt-20 justify-between'>
                            <button className='bg-white border px-24 py-2 rounded-md hover:bg-slate-200' onClick={handlePrevious}>Previous</button>
                            <button className='bg-blue-600 text-white px-24 py-2 rounded-md hover:bg-blue-800'onClick={handleNext}>Next</button>
                        </div>                      
                    </div>


                    <div className={getHideorActive(2)}>
                        <span className='text-lg font-bold'>Parents Information</span>

                        <span className='mt-4'>Father's Information</span>
                        <div className='grid grid-cols-3 gap-2'>
                        <input 
                        type="text" 
                        name=""
                        placeholder='First Name'
                        id="" 
                        className='border-2 p-2 px-6 text-lg font-medium rounded-md focus:outline-blue-400'
                        />

                        <input 
                        type="text" 
                        name=""
                        placeholder='Last Name'
                        id="" 
                        className='border-2 p-2 px-6 text-lg font-medium rounded-md focus:outline-blue-400'
                        />
                        
                        <input 
                        type="text" 
                        name=""
                        placeholder='Middle Name'
                        id="" 
                        className='border-2 p-2 px-6 text-lg font-medium rounded-md focus:outline-blue-400'
                        />  
                        </div>

                        <span className='mt-4'>Mother's Information</span>
                        <div className='grid grid-cols-3 gap-2'>
                        <input 
                        type="text" 
                        name=""
                        placeholder='First Name'
                        id="" 
                        className='border-2 p-2 px-6 text-lg font-medium rounded-md focus:outline-blue-400'
                        />

                        <input 
                        type="text" 
                        name=""
                        placeholder='Last Name'
                        id="" 
                        className='border-2 p-2 px-6 text-lg font-medium rounded-md focus:outline-blue-400'
                        />
                        
                        <input 
                        type="text" 
                        name=""
                        placeholder='Middle Name'
                        id="" 
                        className='border-2 p-2 px-6 text-lg font-medium rounded-md focus:outline-blue-400'
                        />  
                        </div>
                        
                        <span className='mt-4'>Parent's Contact</span>
                        <input 
                        type="text" 
                        name="" 
                        id="" 
                        placeholder='Contact Number'
                        className='border-2 p-2 px-6 text-lg font-medium rounded-md focus:outline-blue-400'/>
                         
                        <div className='flex mt-20 justify-between'>
                            <button className='bg-white border px-24 py-2 rounded-md hover:bg-slate-200' onClick={handlePrevious}>Previous</button>
                            <button className='bg-blue-600 text-white px-24 py-2 rounded-md hover:bg-blue-800'onClick={handleNext}>Next</button>
                        </div>                      
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}