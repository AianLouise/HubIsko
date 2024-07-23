import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";

export default function InboxedApplicationDetail() {

    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => {
        setShowModal(!showModal);
    }

    const closeModal = () => {
        setShowModal(false);
    }
    

    return(
        <div className='flex flex-col min-h-screen'>
            <Header />
            <main className="flex-grow bg-[#f8f8fb] font-medium">

                <div className="max-w-6xl px-24 mx-auto my-20">

                    <div className="border shadow rounded-md h-[800px] p-10">
                        <div className="flex justify-between">
                            <span className="text-2xl">Submitted details:</span>
                            <button onClick={toggleModal} className="border bg-blue-600 rounded-md px-4 py-2 text-white hover:bg-blue-800 ">Request Review</button>
                        </div> 
                    </div>

                </div>

            </main>
            <Footer />



                
          {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-gray-900 bg-opacity-50">
                <div className="bg-white flex-col gap-2 flex text-left p-8 w-1/4 shadow rounded-md border">
                  <h1 className='text-2xl text-center font-bold text-blue-600'>Request to Review?</h1>
                  <span className='text-md text-slate-600 text-center'>After you request a review you'll have to <span className="text-blue-600">wait after 1 week</span> to request again.</span>
                 
                  <div className="justify-between w-full flex gap-2 font-medium mt-4">    
                    <button onClick={closeModal} className="border rounded-md w-full py-2 hover:bg-slate-200">Cancel</button>
                    <button onClick={closeModal} className="bg-blue-600 text-white rounded-md w-full hover:bg-blue-800">Request</button>
                  </div>
                  </div>
              </div>
            )}

        </div>
    
    )

}