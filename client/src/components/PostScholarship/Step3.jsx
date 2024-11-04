import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaBook, FaGraduationCap, FaHandHolding, FaRegCalendarXmark } from "react-icons/fa6";
import { MdOutlineRefresh } from "react-icons/md";
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaUser } from 'react-icons/fa';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Step3 = ({ formData, setFormData }) => {
    // Firebase storage reference
    const storage = getStorage();

    const { currentUser } = useSelector((state) => state.user);

    const [errorMessage, setErrorMessage] = useState('');
    const [scholarshipImage, setScholarshipImage] = useState('https://via.placeholder.com/150');
    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        // Scroll to the top of the page when the component is mounted
        window.scrollTo(0, 0);

        // Simulate data loading
        setTimeout(() => {
            setLoading(false); // Set loading to false after data is loaded
        }, 2000); // Adjust the timeout as needed
    }, []);

    console.log(formData);

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setScholarshipImage(reader.result);
                setErrorMessage(''); // Clear error message on successful image upload
            };
            reader.readAsDataURL(file);

            // Create a reference for the image in Firebase Storage
            const imageRef = ref(storage, `images/${file.name}`);
            try {
                // Upload the file
                await uploadBytes(imageRef, file);
                // Get the download URL
                const imageUrl = await getDownloadURL(imageRef);
                setScholarshipImage(imageUrl); // Use the URL from Firebase Storage

                // Update the form data
                setFormData((prevData) => ({
                    ...prevData,
                    scholarshipImage: imageUrl,
                }));
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        }
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const [bannerImage, setBannerImage] = useState('https://via.placeholder.com/600x200');
    const bannerFileInputRef = useRef(null);
    const [errorMessage2, setErrorMessage2] = useState('');

    const handleBannerImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerImage(reader.result);
                setErrorMessage2(''); // Clear error message on successful image upload
            };
            reader.readAsDataURL(file);

            // Create a reference for the banner image in Firebase Storage
            const bannerRef = ref(storage, `banners/${file.name}`);
            try {
                // Upload the file
                await uploadBytes(bannerRef, file);
                // Get the download URL
                const bannerUrl = await getDownloadURL(bannerRef);
                setBannerImage(bannerUrl); // Use the URL from Firebase Storage

                // Update the form data
                setFormData((prevData) => ({
                    ...prevData,
                    bannerImage: bannerUrl,
                }));
            } catch (error) {
                console.error("Error uploading banner image:", error);
            }
        }
    };

    const handleBannerImageClick = () => {
        bannerFileInputRef.current.click();
    };

    const handleFormDataChange = (field, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const [sections, setSections] = useState(() => {
        return formData.sections || [
            { id: 1, title: 'What is this scholarship for?', content: 'To support students in their academic journey.' },
            { id: 2, title: 'What are the benefits?', content: 'Tuition, Books, Living Expenses' },
            { id: 3, title: 'What are the qualifications?', content: 'High School Diploma' },
            { id: 4, title: 'How can I apply?', content: 'Submit your application online.' },
            { id: 5, title: 'What documents should I prepare?', content: 'Transcript of Records, Birth Certificate' },
        ];
    });

    // Sync sections with formData.sections
    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            sections: sections,
        }));
    }, [sections]);

    const handleEdit = (id, field, value) => {
        setSections(sections.map(section => section.id === id ? { ...section, [field]: value } : section));
    };

    const handleAdd = () => {
        const newSection = { id: Date.now(), title: 'New Section', content: 'New Content' };
        setSections([...sections, newSection]);
    };

    const handleDelete = (id) => {
        setSections(sections.filter(section => section.id !== id));
    };

    const isOpenForAllCourses = formData.fieldOfStudy.includes('Open for All Courses');

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
            </div>
        );
    }

    return (
        <div>
            <main className='flex-grow bg-[#f8f8fb] font-medium'>
                <div className='border-b mb-8 py-8'>
                    <div className='flex flex-row items-center mx-auto max-w-6xl gap-10 px-24'>
                        <div className='flex flex-col items-center'>
                            <span className='text-sm bg-blue-600 text-white px-6 rounded-md py-2'>Click to Upload an Image</span>
                            <div className='bg-white w-36 h-36 my-2 rounded-md flex justify-center items-center relative overflow-hidden'>
                                <img
                                    src={formData.scholarshipImage || 'https://via.placeholder.com/150'}
                                    alt='Scholarship Logo'
                                    className='w-full h-full border-blue-500 hover:border-blue-800 border-4 object-cover rounded-md'
                                    onClick={handleImageClick}
                                    style={{ cursor: 'pointer', opacity: scholarshipImage ? 1 : 0.3 }}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                />
                            </div>
                            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                        </div>

                        <div className='flex flex-col gap-2 w-1/2'>
                            <div className='flex flex-row divide-x-2 divide-blue-200 mb-2'>
                                <span className='text-xl font-bold text-gray-600 pr-4'>
                                    {currentUser ? currentUser.scholarshipProviderDetails.organizationName : 'Scholarship Provider'}
                                </span>
                                <span className='text-xl font-medium text-gray-400 pl-4'>{new Date().toLocaleDateString('en-US')}</span>
                            </div>
                            <h1 className='text-4xl font-bold text-gray-800'>{formData.title}</h1>

                            <div className='flex text-blue-600 font-bold'>
                                <div className='flex flex-row gap-2 px-2 text-xl'>
                                    <FaHandHolding className='' />
                                    {formData.amount}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col items-center mx-auto max-w-6xl gap-8 lg:px-24 p-4'>
                        <div className='flex flex-col gap-2 bg-white shadow-md rounded-md p-6 px-10 hover:bg-gray-200 hover:shadow-lg transition duration-300'>
                            <div className='flex items-center gap-4'>
                                <FaBook className='text-blue-500 w-6 h-6' />
                                <p className='text-base font-semibold'>Field of Study</p>
                            </div>
                            <ul className='grid grid-cols-1 md:grid-cols-2 list-disc list-inside gap-2 mx-auto'>
                                {formData.fieldOfStudy.map((course, index) => (
                                    <li key={index} className='text-base'>{course}</li>
                                ))}
                            </ul>
                        </div>
                        {!isOpenForAllCourses && (
                            <div className='flex flex-col lg:flex-row items-center justify-center w-full gap-4'>
                                <div className='flex items-center gap-4 bg-white shadow-md rounded-md p-4 hover:bg-gray-200 hover:shadow-lg transition duration-300 w-full lg:w-auto'>
                                    <FaMapMarkerAlt className='text-blue-500 w-6 h-6' />
                                    <p className='text-base'>{formData.location}</p>
                                </div>
                                <div className='flex items-center gap-4 bg-white shadow-md rounded-md p-4 hover:bg-gray-200 hover:shadow-lg transition duration-300 w-full lg:w-auto'>
                                    <FaGraduationCap className='text-blue-500 w-6 h-6' />
                                    <p className='text-base'>{formData.educationLevel}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='max-w-6xl px-24 mx-auto mb-20 mt-3'>
                        <div className='flex gap-2'>
                            <span className='flex gap-1 bg-white border px-4 py-2 rounded-md shadow'>
                                <MdOutlineRefresh className='w-6 h-6 text-blue-600' />
                                Last update: {new Date().toLocaleDateString('en-US')}
                            </span>
                            <span className='flex gap-2 bg-white border px-4 py-2 rounded-md shadow items-center'>
                                <FaRegCalendarXmark className='text-red-500' />
                                Deadline:  No deadline set
                            </span>
                        </div>

                        <div className='flex flex-col mt-8 border-b-2'>
                            <span className='text-sm bg-blue-600 text-white px-6 rounded-md py-2 w-[300px] text-center'>Click to Upload an Image</span>
                            <div className='flex justify-center items-center w-full h-52 rounded-md my-4 shadow border relative overflow-hidden'>
                                <img
                                    src={formData.bannerImage || 'https://via.placeholder.com/600x200'}
                                    alt='Scholarship Banner'
                                    className='w-full h-full border-blue-500 hover:border-blue-800 border-4 object-cover rounded-md'
                                    onClick={handleBannerImageClick}
                                    style={{ cursor: 'pointer', opacity: bannerImage ? 1 : 0.3 }}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleBannerImageChange}
                                    ref={bannerFileInputRef}
                                    style={{ display: 'none' }}
                                />
                            </div>
                            {errorMessage2 && <p className="text-red-500 text-center">{errorMessage2}</p>}
                        </div>
                        
                        <div>
                            {formData.description && (
                                <div className='flex flex-col gap-2 mt-8 border rounded-md bg-white'>
                                    <span className='font-bold text-xl text-white bg-blue-600 p-4 rounded-t-md'>Description</span>
                                    <span className='text-sm px-4 pb-4 whitespace-pre-line'>{formData.description}</span>
                                </div>
                            )}
                        </div>

                        <div className='mt-12 flex flex-col justify-center items-center gap-2'>
                            <h2 className='font-bold text-xl text-slate-700'>Description or Frequently Asked Questions!</h2>
                            <span className='text-slate-500'>You can freely edit the title and description of the sections by just clicking!</span>
                        </div>

                        <div className='mb-20'>
                            {sections.map(section => (
                                <div key={section.id} className='flex flex-col gap-2 mt-8 border rounded-md bg-white'>
                                    <div className='flex justify-between items-center bg-blue-600 p-4 rounded-t-md'>
                                        <input
                                            type='text'
                                            value={section.title || ''}
                                            onChange={(e) => handleEdit(section.id, 'title', e.target.value)}
                                            className='font-bold text-xl text-white bg-blue-600 focus:bg-white focus:text-blue-600 flex-grow'
                                            required
                                        />
                                        <button onClick={() => handleDelete(section.id)} className='text-white bg-red-500 hover:bg-red-700 border-2 ml-4 px-6 py-2 rounded-md'>
                                            Delete
                                        </button>
                                    </div>

                                    <textarea
                                        value={section.content || ''}
                                        onChange={(e) => handleEdit(section.id, 'content', e.target.value)}
                                        className='text-sm p-4'
                                        required
                                    />
                                </div>
                            ))}

                            <div className='flex justify-center'>
                                <button type="button" onClick={handleAdd} className='mt-4 px-6 py-2 w-[200px] hover:w-full hover:bg-blue-800 transition-all ease-in-out duration-500  bg-blue-600 text-white rounded-md'>
                                    Add Section
                                </button>
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="flex flex-col gap-2 mt-8 border rounded-md bg-white">
                            <input
                                type="text"
                                value={formData.faqTitle || 'For more details'}
                                onChange={(e) => handleFormDataChange('faqTitle', e.target.value)}
                                className="font-bold text-xl text-white bg-blue-600 p-4 rounded-t-md"
                                required
                            />
                            <textarea
                                value={formData.faqDescription || 'For more details, visit our website.'}
                                onChange={(e) => handleFormDataChange('faqDescription', e.target.value)}
                                className="text-sm p-4"
                                required
                            />

                            <div className='border mx-8'></div>
                            <div className='items-center justify-center flex -translate-y-5'>
                                <span className='bg-white px-8 text-slate-500'>Do you have more questions?</span>
                            </div>

                            {/* Contact Section */}
                            <div className='flex gap-6 justify-center mb-8'>
                                <button type='button' className='bg-white border flex flex-row p-4 gap-2 rounded-md hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out'>
                                    <div className='bg-blue-600 w-12 h-12 rounded-md flex items-center justify-center'>
                                        <FaEnvelope className='text-white' />
                                    </div>
                                    <div className='flex flex-col justify-center'>
                                        <span className='text-slate-600 text-left'>Email Us!</span>
                                        <span className=''>{formData.contactEmail}</span>
                                    </div>
                                </button>

                                <button type='button' className='bg-white border flex flex-row p-4 gap-2 rounded-md hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out'>
                                    <div className='bg-blue-600 w-12 h-12 rounded-md flex items-center justify-center'>
                                        <FaPhone className='text-white' />
                                    </div>
                                    <div className='flex flex-col justify-center'>
                                        <span className='text-slate-600 text-left'>Call us!</span>
                                        <span className=''>{formData.contactPhone}</span>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    className='bg-white border flex flex-row p-4 gap-2 rounded-md hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out'
                                >
                                    <div className='bg-blue-600 w-12 h-12 rounded-md flex items-center justify-center'>
                                        <FaUser className='text-white' />
                                    </div>
                                    <div className='flex flex-col justify-center text-left'>
                                        <span className='text-slate-600'>Visit our profile!</span>
                                        <span className=''>{currentUser ? currentUser.scholarshipProviderDetails.organizationName : 'Scholarship Provider'}</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Step3;