import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function CreateForumPost() {
    const currentUser = useSelector((state) => state.user.currentUser);
    const [formData, setFormData] = useState({
        title: '',
        content: ''
    });
    const [submitTrigger, setSubmitTrigger] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Current User:', currentUser); // Debugging line
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitTrigger(true);
    };

    useEffect(() => {
        if (submitTrigger) {
            const sendApiRequest = async () => {
                try {
                    const response = await fetch('/api/forums/post', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ ...formData, author: currentUser._id })
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const result = await response.json();
                    console.log('Success:', result);
                    navigate('/forums');
                } catch (error) {
                    console.error('Error:', error);
                } finally {
                    setSubmitTrigger(false);
                }
            };

            sendApiRequest();
        }
    }, [submitTrigger, formData, currentUser, navigate]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        // Handle the file upload logic here
    };

    return (
        <div className='flex flex-col min-h-screen'>
            <Header />
            <main className='flex-grow bg-[#f8f8fb] no-scrollbar'>
                <div className='max-w-3xl mx-auto px-4 py-10'>
                    <h1 className='text-3xl font-bold text-gray-800 mb-6 text-center'>Create a New Post</h1>
                    <form onSubmit={handleSubmit} className='bg-white p-6 rounded-md shadow-md'>
                        <div className='mb-4'>
                            <label htmlFor="title" className='block text-lg font-medium text-gray-700 mb-2'>
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                                placeholder="Enter the title of your post"
                            />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor="content" className='block text-lg font-medium text-gray-700 mb-2'>
                                Content
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                                rows="8"
                                placeholder="Write the content of your post"
                            />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor="attachment" className='block text-lg font-medium text-gray-700 mb-2'>
                                Add Attachment
                            </label>
                            <input
                                type="file"
                                id="attachment"
                                name="attachment"
                                onChange={handleFileChange}
                                className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                            />
                        </div>
                        <button
                            type="submit"
                            className='w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-800 transition ease-in-out duration-300'
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}
