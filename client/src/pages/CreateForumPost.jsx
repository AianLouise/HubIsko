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

    return (
        <div className='flex flex-col min-h-screen'>
            <Header />
            <main className='flex-grow bg-[#f8f8fb] no-scrollbar'>
                <div className='max-w-6xl mx-auto px-24 py-8'>
                    <h1 className='text-4xl font-bold text-gray-800 mb-6'>Create a New Post</h1>
                    <form onSubmit={handleSubmit} className='bg-white p-8 rounded-md shadow'>
                        <div className='mb-4'>
                            <label htmlFor="title" className='block text-sm font-medium text-gray-700'>
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm'
                            />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor="content" className='block text-sm font-medium text-gray-700'>
                                Content
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm'
                                rows="5"
                            />
                        </div>
                        <button
                            type="submit"
                            className='w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-800 transition ease-in-out'
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
