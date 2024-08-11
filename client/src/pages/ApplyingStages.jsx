import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaArrowRightLong } from "react-icons/fa6";
import { FaInfoCircle, FaUsers, FaGraduationCap, FaEllipsisH, FaFileContract, FaUpload } from "react-icons/fa";

export default function ApplyingStages() {
    const [activeStep, setActiveStep] = useState(1);
    const maxStep = 4;

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep < maxStep ? prevStep + 1 : prevStep);
    };

    const handlePrevious = () => {
        setActiveStep((prevStep) => Math.max(1, prevStep - 1));
    };

    const getHideorActive = (step) => {
        if (step === activeStep) {
            return 'flex flex-col gap-2 border shadow bg-white w-full h-[auto] rounded-md';
        } else {
            return 'hidden flex flex-col gap-2 border shadow bg-white w-full h-[auto] rounded-md';
        }
    };

    // State variables to manage the selected civil status and input field values
    const [civilStatus, setCivilStatus] = useState('');
    const [maidenName, setMaidenName] = useState('');
    const [spouseName, setSpouseName] = useState('');
    const [spouseOccupation, setSpouseOccupation] = useState('');

    // Function to handle changes in the civil status dropdown
    const handleCivilStatusChange = (e) => {
        const status = e.target.value;
        setCivilStatus(status);

        // Reset input fields if the selected status is not 'Married'
        if (status !== 'Married') {
            setMaidenName('');
            setSpouseName('');
            setSpouseOccupation('');
        }
    };

    // Boolean to check if the selected civil status is 'Married'
    const isMarried = civilStatus === 'Married';

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        middleName: '',
        birthdate: '',
        gender: '',
        bloodType: '',
        civilStatus: '',
        maidenName: '',
        spouseName: '',
        spouseOccupation: '',
        religion: '',
        height: '',
        weight: '',
        birthplace: '',
        contactNumber: '',
        address: '',
        town: '',
        barangay: '',
        province: '',
        fatherFirstName: '',
        fatherLastName: '',
        fatherMiddleName: '',
        motherFirstName: '',
        motherLastName: '',
        motherMiddleName: '',
        parentContact: '',
        education: '',
        schoolName: '',
        yearGraduated: '',
        hobbies: '',
        skills: '',
        languages: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Save formData to the database
        console.log(formData);
    };

    return (
        <div className='flex flex-col min-h-screen'>
            <Header />
            <main className='flex-grow font-medium text-slate-700'>
                <div className='flex flex-col mx-auto max-w-7xl px-24 my-10'>

                    <div>

                        <div className='flex justify-center gap-5 mt-4 mb-8'>
                            {[1, 2, 3, 4, 5, 6].map((step) => (
                                <React.Fragment key={step}>
                                    <div className='flex flex-col gap-1 items-center text-center'>
                                        <span className={`text-xl font-bold ${activeStep === step ? 'text-blue-600' : 'text-gray-400'}`}>{step}</span>
                                        <button
                                            className={`w-12 h-12 shadow rounded-md flex items-center justify-center ${activeStep === step ? 'bg-blue-600' : 'border'}`}
                                            onClick={() => setActiveStep(step)}
                                        >
                                            {step === 1 && <FaInfoCircle className={activeStep === step ? 'text-white' : 'text-blue-600'} />}
                                            {step === 2 && <FaUsers className={activeStep === step ? 'text-white' : 'text-blue-600'} />}
                                            {step === 3 && <FaGraduationCap className={activeStep === step ? 'text-white' : 'text-blue-600'} />}
                                            {step === 4 && <FaEllipsisH className={activeStep === step ? 'text-white' : 'text-blue-600'} />}
                                            {step === 5 && <FaUpload className={activeStep === step ? 'text-white' : 'text-blue-600'} />}
                                            {step === 6 && <FaFileContract className={activeStep === step ? 'text-white' : 'text-blue-600'} />}
                                        </button>
                                        <span className='text-sm text-slate-600'>
                                            {step === 1 && (
                                                <>
                                                    Personal <br /> Information
                                                </>
                                            )}
                                            {step === 2 && "Parents"}
                                            {step === 3 && "Education"}
                                            {step === 4 && "Others"}
                                            {step === 5 && (
                                                <>
                                                    Upload <br /> Requirements
                                                </>
                                            )}
                                            {step === 6 && (
                                                <>
                                                    Terms and <br /> Condition
                                                </>
                                            )}
                                        </span>
                                    </div>
                                    {step < 6 && <FaArrowRightLong className='text-4xl text-blue-600 mt-10' />}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className={`${getHideorActive(1)} max-w-8xl mx-auto bg-white shadow-lg rounded-lg`}>
                            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                                <span className='text-lg font-bold'>Basic Information</span>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>First Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your first name"
                                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Last Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your last name"
                                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Middle Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your middle name"
                                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Birthdate</label>
                                    <input
                                        type="date"
                                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Gender</label>
                                    <select className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'>
                                        <option value="">Select Gender</option>
                                        <option value="Female">Female</option>
                                        <option value="Male">Male</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Blood Type</label>
                                    <select className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'>
                                        <option value="">Select Blood Type</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Civil Status</label>
                                    <select
                                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        value={civilStatus}
                                        onChange={handleCivilStatusChange}
                                    >
                                        <option value="">Select Civil Status</option>
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Divorced">Divorced</option>
                                        <option value="Widowed">Widowed</option>
                                    </select>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Maiden Name</label>
                                    <input
                                        type="text"
                                        value={maidenName}
                                        onChange={(e) => setMaidenName(e.target.value)}
                                        disabled={!isMarried}
                                        placeholder="Enter maiden name"
                                        className={`standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full ${!isMarried ? 'text-gray-400' : ''}`}
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Name of Spouse</label>
                                    <input
                                        type="text"
                                        value={spouseName}
                                        onChange={(e) => setSpouseName(e.target.value)}
                                        disabled={!isMarried}
                                        placeholder="Enter name of spouse"
                                        className={`standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full ${!isMarried ? 'text-gray-400' : ''}`}
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Occupation of Spouse</label>
                                    <input
                                        type="text"
                                        value={spouseOccupation}
                                        onChange={(e) => setSpouseOccupation(e.target.value)}
                                        disabled={!isMarried}
                                        placeholder="Enter occupation of spouse"
                                        className={`standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full ${!isMarried ? 'text-gray-400' : ''}`}
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Religion</label>
                                    <select
                                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                    >
                                        <option value="Roman Catholic">Roman Catholic</option>
                                        <option value="Iglesia ni Cristo">Iglesia ni Cristo</option>
                                        <option value="Islam">Islam</option>
                                        <option value="Born Again Christian">Born Again Christian</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Height</label>
                                    <input
                                        type="number"
                                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        placeholder="Enter height in cm"
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Weight</label>
                                    <input
                                        type="number"
                                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        placeholder="Enter weight in kg"
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Birthplace</label>
                                    <input
                                        type="text"
                                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        placeholder="Enter birthplace"
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Contact Number</label>
                                    <input
                                        type="tel"
                                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        placeholder="Enter contact number"
                                        pattern="^(09|\+639)\d{9}$"
                                        title="Please enter a valid Philippine phone number (e.g., 09123456789 or +639123456789)"
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4 p-4'>
                                <div className='col-span-1'>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        House No./Unit No./Bldg/Floor, Street, Subdivision
                                    </label>
                                    <input
                                        type="text"
                                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        placeholder="Enter address details"
                                    />
                                </div>
                                <div className='col-span-1'>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Town
                                    </label>
                                    <input
                                        type="text"
                                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        placeholder="Enter town"
                                    />
                                </div>
                                <div className='col-span-1'>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Barangay
                                    </label>
                                    <input
                                        type="text"
                                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        placeholder="Enter barangay"
                                    />
                                </div>
                                <div className='col-span-1'>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Province
                                    </label>
                                    <input
                                        type="text"
                                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        placeholder="Enter province"
                                    />
                                </div>
                            </div>


                            <div className='flex mt-10 justify-between p-4'>
                                <button className='bg-white border px-8 py-2 rounded-md hover:bg-slate-200' onClick={handlePrevious}>Previous</button>
                                <button className='bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-800' onClick={handleNext}>Next</button>
                            </div>
                        </div>

                        <div className={`${getHideorActive(2)} max-w-8xl mx-auto bg-white shadow-lg rounded-lg`}>
                            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                                <span className='text-lg font-bold'>Parents Information</span>
                            </div>

                            <div className='p-4'>
                                <span className='text-lg font-bold'>Father's Information</span>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>First Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter father's first name"
                                            className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>Last Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter father's last name"
                                            className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>Middle Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter father's middle name"
                                            className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        />
                                    </div>
                                </div>

                                <span className='text-lg font-bold mt-8 block'>Mother's Information</span>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>First Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter mother's first name"
                                            className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>Last Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter mother's last name"
                                            className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>Middle Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter mother's middle name"
                                            className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        />
                                    </div>
                                </div>

                                <span className='text-lg font-bold mt-8 block'>Parent's Contact</span>
                                <div className='mt-4'>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Contact Number</label>
                                    <input
                                        type="text"
                                        placeholder="Enter contact number"
                                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                    />
                                </div>

                                <div className='flex mt-10 justify-between'>
                                    <button className='bg-white border px-8 py-2 rounded-md hover:bg-slate-200' onClick={handlePrevious}>Previous</button>
                                    <button className='bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-800' onClick={handleNext}>Next</button>
                                </div>
                            </div>
                        </div>

                        <div className={`${getHideorActive(3)} max-w-8xl mx-auto bg-white shadow-lg rounded-lg`}>
                            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                                <span className='text-lg font-bold'>Education Information</span>
                            </div>

                            <div className='p-4'>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>Highest Educational Attainment</label>
                                        <input
                                            type="text"
                                            placeholder="Enter highest educational attainment"
                                            className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>School Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter school name"
                                            className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>Year Graduated</label>
                                        <input
                                            type="text"
                                            placeholder="Enter year graduated"
                                            className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        />
                                    </div>
                                </div>

                                <div className='flex mt-10 justify-between'>
                                    <button className='bg-white border px-8 py-2 rounded-md hover:bg-slate-200' onClick={handlePrevious}>Previous</button>
                                    <button className='bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-800' onClick={handleNext}>Next</button>
                                </div>
                            </div>
                        </div>

                        <div className={`${getHideorActive(4)} max-w-8xl mx-auto bg-white shadow-lg rounded-lg`}>
                            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                                <span className='text-lg font-bold'>Other Information</span>
                            </div>

                            <div className='p-4'>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>Hobbies</label>
                                        <input
                                            type="text"
                                            placeholder="Enter your hobbies"
                                            className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>Skills</label>
                                        <input
                                            type="text"
                                            placeholder="Enter your skills"
                                            className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>Languages Spoken</label>
                                        <input
                                            type="text"
                                            placeholder="Enter languages spoken"
                                            className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        />
                                    </div>
                                </div>

                                <div className='flex mt-10 justify-between'>
                                    <button className='bg-white border px-8 py-2 rounded-md hover:bg-slate-200' onClick={handlePrevious}>Previous</button>
                                    <button className='bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-800' onClick={handleNext}>Next</button>
                                </div>
                            </div>
                        </div>

                        <div className={`${getHideorActive(5)} max-w-8xl mx-auto bg-white shadow-lg rounded-lg`}>
                            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                                <span className='text-lg font-bold'>Upload Requirements</span>
                            </div>

                            <div className='p-4'>
                                <div className='mb-4'>
                                    <p className='text-sm text-gray-700'>
                                        Please upload the following documents:
                                    </p>
                                    <ul className='list-disc list-inside mt-2 text-sm text-gray-700'>
                                        <li>Document 1: Identification Card</li>
                                        <li>Document 2: Proof of Address</li>
                                        <li>Document 3: Academic Transcripts</li>
                                        <li>Document 4: Passport-sized Photo</li>
                                    </ul>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>Identification Card</label>
                                        <input
                                            type="file"
                                            className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>Proof of Address</label>
                                        <input
                                            type="file"
                                            className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>Academic Transcripts</label>
                                        <input
                                            type="file"
                                            className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>Passport-sized Photo</label>
                                        <input
                                            type="file"
                                            className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                        />
                                    </div>
                                </div>

                                <div className='flex mt-10 justify-between'>
                                    <button className='bg-white border px-8 py-2 rounded-md hover:bg-slate-200' onClick={handlePrevious}>Previous</button>
                                    <button className='bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-800' onClick={handleNext}>Next</button>
                                </div>
                            </div>
                        </div>

                        <div className={`${getHideorActive(6)} max-w-8xl mx-auto bg-white shadow-lg rounded-lg`}>
                            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                                <span className='text-lg font-bold'>Terms and Conditions</span>
                            </div>

                            <div className='p-4'>
                                <div className='mb-4'>
                                    <p className='text-sm text-gray-700'>
                                        Please read the following terms and conditions carefully before proceeding:
                                    </p>
                                    <ul className='list-disc list-inside mt-2 text-sm text-gray-700'>
                                        <li>Term 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                                        <li>Term 2: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
                                        <li>Term 3: Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
                                        <li>Term 4: Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</li>
                                        <li>Term 5: Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</li>
                                    </ul>
                                </div>

                                <div className='flex items-center mb-4'>
                                    <input
                                        type="checkbox"
                                        id="agree"
                                        className='mr-2'
                                        required
                                    />
                                    <label htmlFor="agree" className='text-sm text-gray-700'>
                                        I have read and agree to the terms and conditions.
                                    </label>
                                </div>

                                <div className='flex mt-10 justify-between'>
                                    <button className='bg-white border px-8 py-2 rounded-md hover:bg-slate-200' onClick={handlePrevious}>Previous</button>
                                    <button className='bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-800' onClick={handleNext}>Next</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}