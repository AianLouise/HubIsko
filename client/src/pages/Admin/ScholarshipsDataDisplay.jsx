import React from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { Link } from "react-router-dom";
import { FaHandHolding } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdOutlineRefresh } from "react-icons/md";
import { FaRegCalendarXmark } from "react-icons/fa6";
import { BsGlobe2 } from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa";


export default function ScholarshipsDataDisplay() {

    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [declineReason, setDeclineReason] = useState('');
  
    const handleDeclineClick = () => {
      setIsModalOpen(true);
    };
  
    const handleModalClose = () => {
      setIsModalOpen(false);
      setDeclineReason('');
    };
  
    const handleReasonChange = (e) => {
      setDeclineReason(e.target.value);
    };
  
    const handleSubmit = () => {
      // Handle the submit logic here
      console.log('Decline reason:', declineReason);
      handleModalClose();
    };


    const { id } = useParams();
    const [scholarship, setScholarship] = useState(null);

    useEffect(() => {
        const fetchScholarship = async () => {
            try {
                const response = await fetch(`/api/scholarshipProgram/scholarship-programs/${id}`);
                const data = await response.json();
                console.log('Fetched Scholarship:', data); // Add this line
                setScholarship(data);
            } catch (error) {
                console.error('Error fetching scholarship:', error);
            }
        };

        fetchScholarship();
    }, [id]);

    const [organizationName, setOrganizationName] = useState('');

    const fetchOrganizationName = async () => {
        try {
            const response = await fetch(`/api/scholarshipProgram/organization/${scholarship.providerId}`);
            const data = await response.json();
            if (response.ok) {
                setOrganizationName(data.organizationName);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching organization name:', error);
        }
    };

    useEffect(() => {
        if (scholarship) {
            fetchOrganizationName();
        }
    }, [scholarship]);

    if (!scholarship) {
        return <div>Loading...</div>;
    }



    return (
        <div className="flex flex-col min-h-screen font-medium text-slate-700">
        <main className="flex-grow bg-[#f8f8fb] pb-40">

        <div className="flex gap-2 items-center max-w-8xl mx-auto px-24 mt-16">
                <Link to={'/scholarships-data'} className="border shadow px-6 py-2 bg-white rounded-md hover:bg-slate-200">
                    <span>Scholarships</span>
                </Link>

                <IoMdArrowDropdown className='-rotate-90 w-8 h-8 text-blue-600' />

                <Link to={'/scholarships-data-details'} className="border shadow px-6 py-2 bg-white rounded-md hover:bg-slate-200">
                    <span className="">Deped Scholarship Verification</span>
                </Link>

                   
                <IoMdArrowDropdown className='-rotate-90 w-8 h-8 text-blue-600' />

                <div className="border shadow px-6 py-2 bg-white rounded-md">
                    <span className="text-blue-600">Deped Display</span>
                </div>


            </div>
            
            <div className='flex flex-row items-center mx-auto max-w-8xl gap-10 px-24'>
                        <div className='bg-blue-600 w-36 h-36 my-8 rounded-md'>
                            {scholarship.scholarshipImage && (
                                <img
                                    src={scholarship.scholarshipImage}
                                    alt={scholarship.title}
                                    className='w-full h-full object-cover rounded-md'
                                />
                            )}
                        </div>
                        <div className='flex flex-col gap-2 w-1/2'>
                            <div className='flex flex-row divide-x-2 divide-blue-200 mb-2'>
                                <span className='text-2xl font-bold text-gray-600 pr-4'>{organizationName} Name</span>
                                <span className='text-2xl font-medium text-gray-400 pl-4'>{new Date(scholarship.applicationStartDate).toLocaleDateString()}</span>
                            </div>
                            <h1 className='text-4xl font-bold text-gray-800'>{scholarship.title}</h1>

                            <div className='flex text-blue-600 font-bold'>
                                <div className='flex flex-row gap-2 px-2 text-xl'>
                                    <FaHandHolding className='' />
                                    Php 80,000 - Php 100,000
                                </div>
                            </div>      
                        </div>
                    </div>
           
               <div className='max-w-8xl mx-auto px-24 gap-10 flex-col flex'>
                       <div className='flex gap-2'>
                            <span className='flex gap-1 bg-white border px-4 py-2 rounded-md shadow'>
                                <MdOutlineRefresh className='w-6 h-6 text-blue-600' />
                                Last update: 1/11/11
                            </span>
                            <span className='flex gap-2 bg-white border px-4 py-2 rounded-md shadow items-center'>
                                <FaRegCalendarXmark className='w-5 h-5 text-red-600' />
                                Deadline: 1/11/11
                            </span>
                        </div>
                    
                        <div className='flex justify-center bg-white items-center w-full h-52 rounded-md my-4 shadow border'>
                            {scholarship.scholarshipBanner ? (
                                <img src={scholarship.scholarshipBanner} alt="Scholarship Banner" className='w-full h-full object-cover' />
                            ) : 'Scholarship Banner'}
                        </div>

                        <div className='flex flex-col gap-2 mt-8 border rounded-md bg-white'>
                                        <span className='font-bold text-xl text-white bg-blue-600 p-4 rounded-t-md'>What is this for?</span>
                                        <span className='text-sm p-4'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti ullam deleniti eius corporis perferendis. Consequatur eligendi iste ad ipsam at!</span>
                        </div>
                        
                          {/* FAQ Section */}
                          <div className='flex flex-col gap-2 mt-8 border rounded-md bg-white'>
                            <span className='font-bold text-xl text-white bg-blue-600 p-4 rounded-t-md'>Frequently Asked Questions</span>
                            <span className='text-sm p-4'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi, dignissimos hic! Incidunt minima, quidem quos accusamus commodi eos totam eaque nesciunt sapiente, dicta dolorem omnis quaerat adipisci placeat quis reprehenderit fuga vero officiis, suscipit dolorum cumque nobis at! Iusto omnis recusandae quia nam earum. Praesentium quaerat rem perspiciatis illum nisi magni commodi labore, deleniti facilis recusandae. Aliquid repellendus quisquam quas consectetur enim, atque veritatis, quasi, architecto voluptates eveniet dolores dolorum maxime. Velit incidunt accusamus eius ipsam reiciendis consequatur, officia vero fugit cum sapiente voluptatem impedit tempore consectetur minus inventore adipisci in? Laboriosam vero voluptates quisquam quidem amet neque dolores fugiat?</span>

                            <div className='border mx-8'></div>
                            <div className='items-center justify-center flex -translate-y-5'>
                                <span className='bg-white px-8 text-slate-500'>Do you have more questions?</span>
                        </div>

                            {/* Contact Section */}
                            <div className='flex gap-6 justify-center mb-8'>
                                <button className='bg-white border flex flex-row p-4 gap-2 rounded-md hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out'>
                                    <div className='bg-blue-600 w-12 h-12 rounded-md'></div>
                                    <div className='flex flex-col justify-center'>
                                        <span className='text-slate-600 text-left'>Email Us!</span>
                                        <span className=''>Sample@Email.com</span>
                                    </div>
                                </button>

                                <button className='bg-white border flex flex-row p-4 gap-2 rounded-md hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out'>
                                    <div className='bg-blue-600 w-12 h-12 rounded-md'></div>
                                    <div className='flex flex-col justify-center'>
                                        <span className='text-slate-600 text-left'>Call us!</span>
                                        <span className=''>+63-012-3456-789</span>
                                    </div>
                                </button>

                                <button className='bg-white border flex flex-row p-4 gap-2 rounded-md hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out'>
                                    <div className='bg-blue-600 w-12 h-12 rounded-md'></div>
                                    <div className='flex flex-col justify-center text-left'>
                                        <span className='text-slate-600 '>Visit our profile!</span>
                                        <span className=''>Sample</span>
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
                                            <span className='text-lg text-left'>Website Linked:</span>
                                            <span className='text-slate-600'>SampleWebsite.com</span>
                                        </div>
                                    </div>
                                    <BsGlobe2 className='w-8 h-8 ml-4 group-hover:w-12 group-hover:h-12 group-hover:text-blue-600 transition-all ease-in-out' />

                                </button>


                                <button className='bg-white flex items-center border justify-between shadow rounded-md p-4 w-1/2 h-22 hover:-translate-y-2 hover:bg-slate-200 transition ease-in-out group'>

                                <div className='flex flex-row gap-4 '>
                                    <div className='bg-blue-600 w-14 h-14 rounded-md'></div>
                                    <div className='flex flex-col text-left'>
                                        <span className='text-lg'>Apply now in Hubisko!</span>
                                        <span className='text-slate-600'>We'll guide you step by step!</span>
                                    </div>
                                </div>

                                <FaArrowRight className='w-8 h-8 mr-4 group-hover:translate-x-2 group-hover:text-blue-600 transition ease-in-out' />

                                </button>

                            </div>
                        </div>        
            </div>

                        
                        {/* BUTTONS */}

                        <div className="flex justify-end gap-4 px-24">
                        
                        <button
                            type="button"
                            onClick={handleDeclineClick}
                            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-700"
                       
                        >
                            Decline
                        </button>

                        <button
                            type="button"
                            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-800"
                        >
                            Verify
                        </button>
                       
                    </div>
                   
        </main>


        
        {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Reason for Decline</h2>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="4"
              value={declineReason}
              onChange={handleReasonChange}
              placeholder="What are the reasons for declining this scholarship?"
            />
            <div className="flex justify-end gap-4 mt-4">
              <button
                type="button"
                className="border px-4 py-2 rounded-md hover:bg-slate-200"
                onClick={handleModalClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}


        </div>
    );

}