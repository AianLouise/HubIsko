import React, { useState } from "react";

export default function AdminHome() {

    return (
        <div className="flex flex-col min-h-screen">
            
        <main className="flex-grow bg-[#f8f8fb]">
        <div className='border-b mb-8'>
                <div className={'flex items-center mx-auto justify-between px-24'}>
                    <div className='flex flex-col gap-2 w-1/2'>
                    <h1 className='text-4xl font-bold text-gray-800'>Welcome Admin!</h1>
                    <p className='text-lg text-slate-500 font-medium'>Here is your dashboard!</p>
                    </div>
                    <div className='bg-blue-600 w-36 h-36 my-8 rounded-md'></div>
                </div>
                </div>
            <div className='max-w-8xl mx-auto px-24 gap-10 flex-col flex'>
                
       

            </div>
        </main>
        </div>
    );
}