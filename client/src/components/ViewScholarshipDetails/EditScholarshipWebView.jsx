import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaBook, FaGraduationCap, FaHandHolding, FaEnvelope, FaMapMarkerAlt, FaPhone, FaUser } from 'react-icons/fa';
import { FaRegCalendarXmark } from 'react-icons/fa6';
import { MdOutlineRefresh } from 'react-icons/md';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useParams } from 'react-router-dom';

export default function EditScholarshipWebView() {
    const id = useParams();
    const scholarshipId = id.id;
    const [programDetails, setProgramDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProgramDetails = async () => {
        try {
            const response = await fetch(`/api/scholarshipProgram/scholarship-programs/${scholarshipId}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setProgramDetails(data);
        } catch (error) {
            console.error('Error fetching program details:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProgramDetails();
    }, [id]);

    console.log(programDetails);

    const [formData, setFormData] = useState({
        title: programDetails?.title || 'Scholarship Title',
        amount: programDetails?.amount || 'Full Scholarship',
        fieldOfStudy: programDetails?.fieldOfStudy || 'Computer Science',
        location: programDetails?.location || 'United States',
        educationLevel: programDetails?.educationLevel || 'Undergraduate',
        scholarshipImage: programDetails?.scholarshipImage || 'https://via.placeholder.com/150',
        bannerImage: programDetails?.bannerImage || 'https://via.placeholder.com/600x200',
        sections: programDetails?.sections || [
            { id: 1, title: 'What is this scholarship for?', content: 'To support students in their academic journey.' },
            { id: 2, title: 'What are the benefits?', content: 'Tuition, Books, Living Expenses' },
            { id: 3, title: 'What are the qualifications?', content: 'High School Diploma' },
            { id: 4, title: 'How can I apply?', content: 'Submit your application online.' },
            { id: 5, title: 'What documents should I prepare?', content: 'Transcript of Records, Birth Certificate' },
        ],
        faqTitle: programDetails?.faqTitle || 'Frequently Asked Questions',
        faqDescription: programDetails?.faqDescription || 'For more details, visit our website.',
        contactEmail: programDetails?.contactEmail || '',
        contactPhone: programDetails?.contactPhone || '',
    });

    useEffect(() => {
        if (programDetails) {
            setFormData({
                title: programDetails.title || 'Scholarship Title',
                amount: programDetails.amount || 'Full Scholarship',
                fieldOfStudy: programDetails.fieldOfStudy || 'Computer Science',
                location: programDetails.location || 'United States',
                educationLevel: programDetails.educationLevel || 'Undergraduate',
                scholarshipImage: programDetails.scholarshipImage || 'https://via.placeholder.com/150',
                bannerImage: programDetails.bannerImage || 'https://via.placeholder.com/600x200',
                sections: programDetails.sections || [
                    { id: 1, title: 'What is this scholarship for?', content: 'To support students in their academic journey.' },
                    { id: 2, title: 'What are the benefits?', content: 'Tuition, Books, Living Expenses' },
                    { id: 3, title: 'What are the qualifications?', content: 'High School Diploma' },
                    { id: 4, title: 'How can I apply?', content: 'Submit your application online.' },
                    { id: 5, title: 'What documents should I prepare?', content: 'Transcript of Records, Birth Certificate' },
                ],
                faqTitle: programDetails.faqTitle || 'Frequently Asked Questions',
                faqDescription: programDetails.faqDescription || 'For more details, visit our website.',
                contactEmail: programDetails.contactEmail || '',
                contactPhone: programDetails.contactPhone || '',
            });
        }
    }, [programDetails]);

    const [isEditMode, setIsEditMode] = useState(false);

    // Firebase storage reference
    const storage = getStorage();

    const { currentUser } = useSelector((state) => state.user);

    const [errorMessage, setErrorMessage] = useState('');
    const [scholarshipImage, setScholarshipImage] = useState('https://via.placeholder.com/150');
    const fileInputRef = useRef(null);

    useEffect(() => {
        // Scroll to the top of the page when the component is mounted
        window.scrollTo(0, 0);
    }, []);

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

    const [sections, setSections] = useState([
        { id: 1, title: 'What is this scholarship for?', content: 'To support students in their academic journey.' },
        { id: 2, title: 'What are the benefits?', content: 'Tuition, Books, Living Expenses' },
        { id: 3, title: 'What are the qualifications?', content: 'High School Diploma' },
        { id: 4, title: 'How can I apply?', content: 'Submit your application online.' },
        { id: 5, title: 'What documents should I prepare?', content: 'Transcript of Records, Birth Certificate' },
    ]);

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
                                    onClick={isEditMode ? handleImageClick : null}
                                    style={{ cursor: isEditMode ? 'pointer' : 'default', opacity: scholarshipImage ? 1 : 0.3 }}
                                />
                                {isEditMode && (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                    />
                                )}
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

                    <div className='flex flex-col lg:flex-row items-center mx-auto max-w-6xl gap-2 lg:gap-10 lg:px-24 p-4'>
                        <div className='flex flex-col lg:flex-row items-center mx-auto max-w-6xl gap-2 lg:gap-10 lg:px-24 p-2'>
                            <div className='flex items-center gap-4 bg-white shadow-md rounded-md p-4 hover:bg-gray-200 hover:shadow-lg transition duration-300'>
                                <FaBook className='text-blue-500 w-6 h-6' />
                                <p className='text-base'>{formData.fieldOfStudy}</p>
                            </div>
                            <div className='flex items-center gap-4 bg-white shadow-md rounded-md p-4 hover:bg-gray-200 hover:shadow-lg transition duration-300'>
                                <FaMapMarkerAlt className='text-blue-500 w-6 h-6' />
                                <p className='text-base'>{formData.location}</p>
                            </div>
                            <div className='flex items-center gap-4 bg-white shadow-md rounded-md p-4 hover:bg-gray-200 hover:shadow-lg transition duration-300'>
                                <FaGraduationCap className='text-blue-500 w-6 h-6' />
                                <p className='text-base'>{formData.educationLevel}</p>
                            </div>
                        </div>
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
                                    onClick={isEditMode ? handleBannerImageClick : null}
                                    style={{ cursor: isEditMode ? 'pointer' : 'default', opacity: bannerImage ? 1 : 0.3 }}
                                />
                                {isEditMode && (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleBannerImageChange}
                                        ref={bannerFileInputRef}
                                        style={{ display: 'none' }}
                                    />
                                )}
                            </div>
                            {errorMessage2 && <p className="text-red-500 text-center">{errorMessage2}</p>}
                        </div>

                        <div className='mt-12 flex flex-col justify-center items-center gap-2'>
                            <h2 className='font-bold text-xl text-slate-700'>Description or Frequently Asked Questions!</h2>
                            <span className='text-slate-500'>You can freely edit the title and description of the sections by just clicking!</span>
                        </div>

                        <div className='mb-20'>
                            {sections.map(section => (
                                <div key={section.id} className='flex flex-col gap-2 mt-8 border rounded-md bg-white'>
                                    <div className='flex justify-between items-center bg-blue-600 p-4 rounded-t-md'>
                                        {isEditMode ? (
                                            <input
                                                type='text'
                                                value={section.title || ''}
                                                onChange={(e) => handleEdit(section.id, 'title', e.target.value)}
                                                className='font-bold text-xl text-white bg-blue-600 focus:bg-white focus:text-blue-600 flex-grow'
                                                required
                                            />
                                        ) : (
                                            <h3 className='font-bold text-xl text-white'>{section.title}</h3>
                                        )}
                                        {isEditMode && (
                                            <button onClick={() => handleDelete(section.id)} className='text-white bg-red-500 hover:bg-red-700 border-2 ml-4 px-6 py-2 rounded-md'>
                                                Delete
                                            </button>
                                        )}
                                    </div>

                                    {isEditMode ? (
                                        <textarea
                                            value={section.content || ''}
                                            onChange={(e) => handleEdit(section.id, 'content', e.target.value)}
                                            className='text-sm p-4'
                                            required
                                        />
                                    ) : (
                                        <p className='text-sm p-4'>{section.content}</p>
                                    )}
                                </div>
                            ))}

                            {isEditMode && (
                                <div className='flex justify-center'>
                                    <button type="button" onClick={handleAdd} className='mt-4 px-6 py-2 w-[200px] hover:w-full hover:bg-blue-800 transition-all ease-in-out duration-500  bg-blue-600 text-white rounded-md'>
                                        Add Section
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* FAQ Section */}
                        <div className="flex flex-col gap-2 mt-8 border rounded-md bg-white">
                            {isEditMode ? (
                                <>
                                    <input
                                        type="text"
                                        value={formData.faqTitle || 'Frequently Asked Questions'}
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
                                </>
                            ) : (
                                <>
                                    <h3 className='font-bold text-xl text-blue-600 p-4'>{formData.faqTitle}</h3>
                                    <p className='text-sm p-4'>{formData.faqDescription}</p>
                                </>
                            )}

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
                <div className='flex justify-center mb-8'>
                    <button
                        type="button"
                        onClick={() => setIsEditMode(!isEditMode)}
                        className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-800 transition duration-300'
                    >
                        {isEditMode ? 'Save' : 'Edit'}
                    </button>
                </div>
            </main>
        </div>
    );
}