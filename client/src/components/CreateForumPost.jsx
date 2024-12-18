import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AiFillFilePdf, AiFillFileWord, AiOutlinePaperClip } from 'react-icons/ai';
import { FaTrashAlt } from 'react-icons/fa';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { format } from 'date-fns';

export default function CreateForumPost() {
    const [formData, setFormData] = useState({ title: '', content: '' });
    const currentUser = useSelector((state) => state.user.currentUser);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [submitTrigger, setSubmitTrigger] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const fileObjs = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setSelectedFiles((prevFiles) => [...prevFiles, ...fileObjs]);

        // Log file names to the console
        files.forEach(file => console.log(`File added: ${file.name}`));
    };

    const handleRemoveFile = (index) => {
        setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleAttachmentClick = () => {
        document.getElementById('fileInput').click();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitTrigger(true);

        const storage = getStorage();

        // Upload files to Firebase and get the file URLs
        const uploadedFilePaths = await Promise.all(selectedFiles.map(async (fileObj) => {
            const file = fileObj.file;
            const fileExtension = file.name.split('.').pop(); // Extract the file extension
            const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, ""); // Remove the extension from the original file name
            const fileName = `${fileNameWithoutExtension}_${format(new Date(), 'yyyyMMdd')}.${fileExtension}`;
            const storageRef = ref(storage, `forum_uploads/${fileName}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            return downloadURL; // Save the download URL in the database
        }));

        // Send post data to the backend
        const postData = {
            ...formData,
            author: currentUser._id,
            attachments: uploadedFilePaths // Save file paths in the database
        };

        try {
            const response = await fetch('/api/forums/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
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

    return (
        <div className='flex flex-col min-h-screen'>
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
                                placeholder="Enter the content of your post"
                            />
                        </div>
                        <div className='mb-4 flex flex-col items-center'>
                            <div className='flex items-center'>
                                <input
                                    type="file"
                                    id="fileInput"
                                    name="file"
                                    onChange={handleFileChange}
                                    className='hidden'
                                    multiple
                                />
                            </div>
                        </div>
                        <div className='flex justify-end items-center'>
                            <button
                                type="button"
                                className='bg-blue-600 text-white p-3 rounded-md mx-2 hover:bg-blue-800 flex items-center justify-center'
                                onClick={handleAttachmentClick}
                            >
                                <AiOutlinePaperClip className="w-6 h-6" />
                            </button>
                            <button
                                type="submit"
                                className='bg-blue-600 text-white p-3 rounded-md hover:bg-blue-800 transition ease-in-out'
                            >
                                Create Post
                            </button>
                        </div>
                    </form>
                    {selectedFiles.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-medium mb-2">Attached Files:</h4>
                            <ul className="grid grid-cols-2 gap-4">
                                {selectedFiles.map((fileObj, index) => (
                                    <li key={index} className="flex flex-col items-center justify-center space-y-2 p-2 border rounded-md shadow-sm h-40">
                                        {fileObj.file.type.startsWith('image/') ? (
                                            <>
                                                <img
                                                    src={fileObj.url}
                                                    alt={fileObj.file.name}
                                                    className="w-24 h-24 object-cover rounded-md shadow"
                                                />
                                                <span className="text-sm text-gray-600 text-center">{fileObj.file.name}</span>
                                            </>
                                        ) : fileObj.file.type === 'application/pdf' ? (
                                            <div className="flex flex-col items-center justify-center h-full">
                                                <AiFillFilePdf className="w-8 h-8 text-red-600" />
                                                <a href={fileObj.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-center">
                                                    {fileObj.file.name}
                                                </a>
                                            </div>
                                        ) : fileObj.file.type === 'application/msword' || fileObj.file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? (
                                            <div className="flex flex-col items-center justify-center h-full">
                                                <AiFillFileWord className="w-8 h-8 text-blue-600" />
                                                <a href={fileObj.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-center">
                                                    {fileObj.file.name}
                                                </a>
                                            </div>
                                        ) : (
                                            <a href={fileObj.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-center">
                                                {fileObj.file.name}
                                            </a>
                                        )}
                                        <button
                                            type="button"
                                            className="text-red-600 hover:text-red-800 flex items-center"
                                            onClick={() => handleRemoveFile(index)}
                                        >
                                            <FaTrashAlt className="mr-1" /> Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
