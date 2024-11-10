import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaBook, FaGraduationCap, FaHandHolding, FaEnvelope, FaMapMarkerAlt, FaPhone, FaUser } from 'react-icons/fa';
import { FaRegCalendarXmark } from 'react-icons/fa6';
import { MdOutlineRefresh } from 'react-icons/md';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useParams, useNavigate } from 'react-router-dom';
import CustomNotification from '../../components/CustomNotification';
import { FaArrowLeft } from 'react-icons/fa';

export default function EditScholarshipWebView() {
    const id = useParams();
    const scholarshipId = id.id;
    const navigate = useNavigate();
    const [programDetails, setProgramDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '' });

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
        fieldOfStudy: programDetails?.fieldOfStudy || [],
        location: programDetails?.location || 'United States',
        educationLevel: programDetails?.educationLevel || 'Undergraduate',
        applicationDeadline: programDetails?.applicationDeadline || new Date().toISOString(),
        scholarshipImage: programDetails?.scholarshipImage || 'https://via.placeholder.com/150',
        bannerImage: programDetails?.bannerImage || 'https://via.placeholder.com/600x200',
        description: programDetails?.description || '',
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
                fieldOfStudy: programDetails.fieldOfStudy || [],
                location: programDetails.location || 'United States',
                educationLevel: programDetails.educationLevel || 'Undergraduate',
                applicationDeadline: programDetails.applicationDeadline || new Date().toISOString(),
                scholarshipImage: programDetails.scholarshipImage || 'https://via.placeholder.com/150',
                bannerImage: programDetails.bannerImage || 'https://via.placeholder.com/600x200',
                description: programDetails.description || '',
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

    const handleAdd = () => {
        const newSection = { id: Date.now(), title: 'New Section', content: 'New Content' };
        setFormData(prevFormData => ({
            ...prevFormData,
            sections: [...prevFormData.sections, newSection]
        }));
    };

    const handleDelete = (id) => {
        console.log('Deleting section with id:', id); // Debugging line
        setFormData(prevFormData => ({
            ...prevFormData,
            sections: prevFormData.sections.filter(section => section._id !== id)
        }));
    };

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

    const handleSectionChange = (index, field, value) => {
        const updatedSections = [...formData.sections];
        updatedSections[index][field] = value;
        setFormData((prevData) => ({
            ...prevData,
            sections: updatedSections,
        }));
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/scholarshipProgram/scholarship-programs/${scholarshipId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error('Failed to update scholarship details');
            const data = await response.json();
            setProgramDetails(data);
            setNotification({ message: 'Scholarship details updated successfully', type: 'success' });
            setTimeout(() => {
                navigate(-1); // Redirect to the desired page
            }, 2000); // Adjust the delay as needed
        } catch (error) {
            console.error('Error updating scholarship details:', error);
            setError(error.message);
            setNotification({ message: error.message, type: 'error' });
        }
    };

    const formatDate = (dateString) => {
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const isEmailLong = formData.contactEmail.length > 30;
    const isPhoneLong = formData.contactPhone.length > 20;


    return (
        <div>
            <main className='flex-grow bg-[#f8f8fb] font-medium'>
                {notification.message && (
                    <CustomNotification
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification({ message: '', type: '' })}
                    />
                )}
                <div className='border-b py-8'>
                    <div className="my-8 text-center relative">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="absolute left-10 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            <FaArrowLeft className="mr-2" />
                            <span>Back</span>
                        </button>
                        <div className="inline-block">
                            <h2 className="text-3xl font-extrabold text-blue-600">
                                Edit Scholarship Web View
                            </h2>
                            <p className="text-sm font-normal text-gray-500 mt-2">
                                Update the scholarship web view information below to ensure all details are accurate and up-to-date.
                            </p>
                        </div>
                    </div>

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

                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-row divide-x-2 divide-blue-200 mb-2'>
                                <span className='text-xl font-bold text-gray-600 pr-4'>
                                    {programDetails ? programDetails.organizationName : 'Scholarship Provider'}
                                </span>
                                <span className='text-xl font-medium text-gray-400 pl-4'>{formatDate(new Date())}</span>
                            </div>
                            <h1 className='text-4xl font-bold text-gray-800'>{formData.title}</h1>

                            <div className='flex text-blue-600 font-bold items-center justify-center lg:justify-start'>
                                <div className='flex items-center gap-2 px-10 py-2 lg:py-0 lg:px-2 text-xl bg-slate-200 rounded-md lg:bg-[#f8f8fb]'>
                                    <FaHandHolding className='w-6 h-6 flex-shrink-0' style={{ marginTop: '-10px' }} />
                                    {formData.amount}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col items-center mx-auto max-w-6xl gap-8 lg:px-24 p-4'>
                        <div className='flex flex-col gap-2 bg-white shadow-md rounded-md p-6 px-10 hover:bg-gray-200 hover:shadow-lg transition duration-300 items-center'>
                            <div className='flex items-center gap-4'>
                                <FaBook className='text-blue-500 w-6 h-6' />
                                <p className='text-base font-semibold'>Field of Study</p>
                            </div>
                            {formData.fieldOfStudy && (
                                <ul className='grid grid-cols-1 md:grid-cols-2 list-disc list-inside gap-2'>
                                    {formData.fieldOfStudy.map((course, index) => (
                                        <li key={index} className='text-base'>{course}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
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
                    </div>

                    <div className='max-w-6xl px-24 mx-auto mb-20 mt-3'>
                        <div className='flex gap-2'>
                            <span className='flex gap-1 bg-white border px-4 py-2 rounded-md shadow items-center'>
                                <MdOutlineRefresh className='w-6 h-6 text-blue-600' />
                                Last update: {formatDate(new Date())}
                            </span>
                            <span className='flex gap-2 bg-white border px-4 py-2 rounded-md shadow items-center'>
                                <FaRegCalendarXmark className='text-red-500 w-6 h-6' />
                                Deadline: {formatDate(formData.applicationDeadline)}
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
                            {formData.sections.map((section, index) => (
                                <div key={section.id} className='flex flex-col gap-2 mt-8 border rounded-md bg-white'>
                                    <div className='flex justify-between items-center bg-blue-600 p-4 rounded-t-md'>
                                        <input
                                            type="text"
                                            value={section.title}
                                            onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                                            className='font-bold text-xl text-white bg-blue-600 rounded-t-md w-full'
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(section._id)}
                                            className='ml-4 px-4 py-2 bg-red-600 text-white rounded-md'
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <textarea
                                        value={section.content}
                                        onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                                        className='text-sm p-4 w-full'
                                    />
                                </div>
                            ))}

                            <div className='flex justify-center'>
                                <button type="button" onClick={handleAdd} className='mt-4 px-6 py-2 w-[200px] hover:w-full hover:bg-blue-800 transition-all ease-in-out duration-500 bg-blue-600 text-white rounded-md'>
                                    Add Section
                                </button>
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="flex flex-col gap-2 mt-8 border rounded-md bg-white">
                            <input
                                type="text"
                                value={formData.faqTitle}
                                onChange={(e) => handleFormDataChange('faqTitle', e.target.value)}
                                className="font-bold text-xl text-white bg-blue-600 p-4 rounded-t-md w-full"
                                required
                            />
                            <textarea
                                value={formData.faqDescription}
                                onChange={(e) => handleFormDataChange('faqDescription', e.target.value)}
                                className="text-sm p-4 whitespace-pre-line w-full"
                                required
                            />

                            <div className='border mx-8'></div>
                            <div className='items-center justify-center flex -translate-y-5'>
                                <span className='bg-white px-8 text-slate-500'>Do you have more questions?</span>
                            </div>

                            {/* Contact Section */}
                            <div className={`flex flex-col ${isEmailLong || isPhoneLong ? 'space-y-6' : 'lg:flex-row lg:space-x-6'} justify-center items-center mb-8 px-3`}>
                                <button className='bg-white border flex flex-row p-4 gap-2 rounded-md hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out w-full lg:w-1/2'>
                                    <div className='bg-blue-600 w-12 h-12 rounded-md flex items-center justify-center'>
                                        <FaEnvelope className='text-white' />
                                    </div>
                                    <div className='flex flex-col justify-center flex-grow'>
                                        <span className='text-slate-600 text-left'>Email Us!</span>
                                        <span className='text-ellipsis overflow-hidden break-words max-w-[300px]'>{formData.contactEmail}</span>
                                    </div>
                                </button>

                                {!isEmailLong && (
                                    <button className='bg-white border flex flex-row p-4 gap-2 rounded-md hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out w-full lg:w-1/2'>
                                        <div className='bg-blue-600 w-12 h-12 rounded-md flex items-center justify-center'>
                                            <FaPhone className='text-white' />
                                        </div>
                                        <div className='flex flex-col justify-center flex-grow'>
                                            <span className='text-slate-600 text-left'>Call us!</span>
                                            <span className='text-ellipsis overflow-hidden break-words max-w-[300px]'>{formData.contactPhone}</span>
                                        </div>
                                    </button>
                                )}

                                {!isEmailLong && !isPhoneLong && (
                                    <button className='bg-white border flex flex-row p-4 gap-2 rounded-md hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out w-full lg:w-1/2'>
                                        <div className='bg-blue-600 w-12 h-12 rounded-md flex items-center justify-center'>
                                            <FaUser className='text-white' />
                                        </div>
                                        <div className='flex flex-col justify-center text-left flex-grow'>
                                            <span className='text-slate-600'>Visit our profile!</span>
                                            <span className='text-ellipsis overflow-hidden break-words max-w-[300px]'>{formData.organizationName}</span>
                                        </div>
                                    </button>
                                )}

                                {isEmailLong && (
                                    <button className='bg-white border flex flex-row p-4 gap-2 rounded-md hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out w-full lg:w-1/2'>
                                        <div className='bg-blue-600 w-12 h-12 rounded-md flex items-center justify-center'>
                                            <FaPhone className='text-white' />
                                        </div>
                                        <div className='flex flex-col justify-center flex-grow'>
                                            <span className='text-slate-600 text-left'>Call us!</span>
                                            <span className='text-ellipsis overflow-hidden break-words max-w-[300px]'>{formData.contactPhone}</span>
                                        </div>
                                    </button>
                                )}

                                {(isEmailLong || isPhoneLong) && (
                                    <button className='bg-white border flex flex-row p-4 gap-2 rounded-md hover:bg-slate-200 hover:-translate-y-2 transition ease-in-out w-full lg:w-1/2'>
                                        <div className='bg-blue-600 w-12 h-12 rounded-md flex items-center justify-center'>
                                            <FaUser className='text-white' />
                                        </div>
                                        <div className='flex flex-col justify-center text-left flex-grow'>
                                            <span className='text-slate-600'>Visit our profile!</span>
                                            <span className='text-ellipsis overflow-hidden break-words max-w-[300px]'>{programDetails.organizationName}</span>
                                        </div>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className='flex justify-end p-4'>
                            <button
                                type="button"
                                onClick={handleSaveChanges}
                                className='px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300'
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}