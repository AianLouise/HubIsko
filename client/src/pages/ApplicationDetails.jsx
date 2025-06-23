import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaHandHolding, FaRegCalendarXmark, FaArrowRightLong, FaGraduationCap, FaBook } from "react-icons/fa6";
import { MdOutlineRefresh } from "react-icons/md";
import { BsGlobe2 } from "react-icons/bs";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { CgClose } from 'react-icons/cg';
import NewLogo from '../assets/NewLogoClean.png';
import useTokenExpiry from '../hooks/useTokenExpiry'; // Adjust the import path
import { FaPersonCirclePlus } from "react-icons/fa6";
import { regions, provinces, cities, barangays } from 'select-philippines-address';

export default function Forums() {
    useTokenExpiry();

    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        if (currentUser) {
            if (currentUser.role === 'admin') {
                navigate('/admin-dashboard');
            } else if (currentUser.role === 'scholarship_provider') {
                if (!currentUser.emailVerified) {
                    navigate('/verify-your-email', { state: { email: currentUser.email } });
                } else {
                    navigate('/provider-dashboard');
                }
            }
        }
    }, [currentUser, navigate]);

    const { id } = useParams();
    const [scholarship, setScholarship] = useState(null);

    const isLoggedIn = Boolean(currentUser);
    const [notification, setNotification] = useState('');
    const [notification2, setNotification2] = useState('');
    const [userDetails, setUserDetails] = useState(null);

    const fetchUserDetails = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await fetch(`${apiUrl}/api/auth/user/${currentUser._id}`);
            const data = await response.json();
            setUserDetails(data);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const fetchScholarship = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await fetch(`${apiUrl}/api/scholarshipProgram/scholarship-programs/${id}`);
            const data = await response.json();
            setScholarship(data);
        } catch (error) {
            console.error('Error fetching scholarship:', error);
        }
    };

    useEffect(() => {
        fetchScholarship();
        fetchUserDetails();
    }, [id]);

    const [formData, setFormData] = useState({
        region: '',
        province: '',
        city: '',
        barangay: '',
    });

    const [regionList, setRegionList] = useState([]);
    const [provinceList, setProvinceList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [barangayList, setBarangayList] = useState([]);

    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedBarangay, setSelectedBarangay] = useState('');

    // New state to store full address names
    const [fullAddress, setFullAddress] = useState({
        regionName: '',
        provinceName: '',
        cityName: '',
        barangayName: ''
    });

    // Fetch all regions on component mount
    useEffect(() => {
        regions().then(setRegionList);
    }, []);

    // Fetch provinces when a region is selected
    useEffect(() => {
        if (selectedRegion) {
            provinces(selectedRegion).then(data => {
                setProvinceList(data);
                const regionName = regionList.find(region => region.region_code === selectedRegion)?.region_name;
                setFormData(prevState => ({
                    ...prevState,
                    region: selectedRegion,
                    regionName: regionName, // Save full region name
                    province: '',
                    city: '',
                    barangay: ''
                }));
                setFullAddress(prevState => ({ ...prevState, regionName }));
            });
        }
    }, [selectedRegion, regionList]);

    // Fetch cities when a province is selected
    useEffect(() => {
        if (selectedProvince) {
            cities(selectedProvince).then(data => {
                setCityList(data);
                const provinceName = provinceList.find(province => province.province_code === selectedProvince)?.province_name;
                setFormData(prevState => ({
                    ...prevState,
                    province: selectedProvince,
                    provinceName: provinceName, // Save full province name
                    city: '',
                    barangay: ''
                }));
                setFullAddress(prevState => ({ ...prevState, provinceName }));
            });
        }
    }, [selectedProvince, provinceList]);

    // Fetch barangays when a city is selected
    useEffect(() => {
        if (selectedCity) {
            barangays(selectedCity).then(data => {
                setBarangayList(data);
                const cityName = cityList.find(city => city.city_code === selectedCity)?.city_name;
                setFormData(prevState => ({
                    ...prevState,
                    city: selectedCity,
                    cityName: cityName, // Save full city name
                    barangay: ''
                }));
                setFullAddress(prevState => ({ ...prevState, cityName }));
            });
        }
    }, [selectedCity, cityList]);

    // Update formData when barangay is selected
    useEffect(() => {
        if (selectedBarangay) {
            const barangayName = barangayList.find(barangay => barangay.brgy_code === selectedBarangay)?.brgy_name;
            setFormData(prevState => ({
                ...prevState,
                barangay: selectedBarangay,
                barangayName: barangayName // Save full barangay name
            }));
            setFullAddress(prevState => ({ ...prevState, barangayName }));
        }
    }, [selectedBarangay, barangayList]);

    // Load initial data from formData
    useEffect(() => {
        const dummyData = {
            region: userDetails?.applicantDetails?.address?.region || '',
            province: userDetails?.applicantDetails?.address?.province || '',
            city: userDetails?.applicantDetails?.address?.city || '',
            barangay: userDetails?.applicantDetails?.address?.barangay || '',
        };

        setSelectedRegion(dummyData.region);
        setSelectedProvince(dummyData.province);
        setSelectedCity(dummyData.city);
        setSelectedBarangay(dummyData.barangay);
    }, [userDetails]);

    // Fetch city name based on initial city code
    useEffect(() => {
        if (selectedCity) {
            const cityName = cityList.find(city => city.city_code === selectedCity)?.city_name;
            setFormData(prevState => ({
                ...prevState,
                cityName: cityName // Save full city name
            }));
            setFullAddress(prevState => ({ ...prevState, cityName }));
        }
    }, [selectedCity, cityList]);

    const handleApplyClick = async () => {
        fetchScholarship();
        if (!isLoggedIn) {
            setNotification('You must be logged in to apply for scholarships.');
        } else if (userDetails?.status === 'Pending Verification') {
            setNotification('Your account is currently under verification. You cannot apply for scholarships until your account is fully verified.');
        } else if (userDetails?.status === 'Verify Account') {
            setNotification('You need to verify your account before applying for scholarships. Please visit the verification page.');
        } else if (scholarship?.numberOfScholarships == scholarship?.approvedScholars) {
            setNotification('Applications are closed as the slots are full. Please check back later.');
        } else if (
            !scholarship?.fieldOfStudy.includes('Open for All Courses') &&
            !scholarship?.fieldOfStudy.includes(userDetails?.applicantDetails?.education?.college?.course)
        ) {
            setNotification('You are not eligible to apply for this scholarship based on your field of study.');
        } else if (
            scholarship?.location !== 'Open for Any Location' &&
            scholarship?.location !== formData.cityName
        ) {
            setNotification('You are not eligible to apply for this scholarship based on your location.');
        } else if (new Date() > new Date(scholarship?.applicationDeadline)) {
            setNotification('The deadline for this scholarship has passed.');
        } else {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
                const response = await fetch(`${apiUrl}/api/scholarshipProgram/${scholarship.id}/has-applied/${currentUser._id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                if (data.hasApplied) {
                    setNotification2('You have already applied for this scholarship.');
                } else {
                    navigate(`/scholarship-application/${scholarship.id}`);
                }
            } catch (error) {
                console.error('Error checking application status:', error);
                setNotification2('An error occurred while checking your application status. Please try again later.');
            }
        }
    };

    const formatDate = (dateString) => {
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    if (!scholarship) {
        return (
            <div className="flex justify-center items-center h-screen">
                <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
            </div>
        );
    }

    const isOpenForAllCourses = scholarship.fieldOfStudy.includes('Open for All Courses');

    const isEmailLong = scholarship.contactEmail.length > 30;
    const isPhoneLong = scholarship.contactPhone.length > 20;

    return (
        <div className='min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50'>
            <Header />
            <main className='flex-grow'>
                {/* Hero Section */}
                <div className='bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-8'>
                    <div className='max-w-6xl mx-auto px-4 lg:px-6'>
                        <div className='flex flex-col lg:flex-row items-center gap-6'>
                            <div className='relative group'>
                                <div className='bg-white/10 backdrop-blur-sm w-28 h-28 lg:w-32 lg:h-32 rounded-xl p-2 shadow-xl border border-white/20'>
                                    {scholarship.scholarshipImage ? (
                                        <img
                                            src={scholarship.scholarshipImage}
                                            alt={scholarship.title}
                                            className='w-full h-full object-cover rounded-lg'
                                        />
                                    ) : (
                                        <div className='w-full h-full bg-white/20 rounded-lg flex items-center justify-center'>
                                            <FaGraduationCap className='w-10 h-10 text-white/60' />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className='flex-1 text-center lg:text-left'>
                                <div className='flex flex-col lg:flex-row items-center lg:items-start gap-2 mb-3'>
                                    <span className='bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-blue-100 font-medium text-sm border border-white/30'>
                                        {scholarship.organizationName}
                                    </span>
                                    <span className='text-blue-200 font-medium text-sm'>
                                        {formatDate(scholarship.applicationStartDate)}
                                    </span>
                                </div>

                                <h1 className='text-2xl lg:text-3xl font-bold mb-4 leading-tight'>
                                    {scholarship.title}
                                </h1>

                                <div className='inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30'>
                                    <span className='text-base font-bold text-white'>{scholarship.amount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Information Cards */}
                <div className='max-w-6xl mx-auto px-4 lg:px-6 mt-6 relative z-10'>
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6'>
                        {/* Field of Study Card */}
                        <div className='lg:col-span-2 bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
                            <div className='bg-gradient-to-r from-blue-600 to-blue-700 p-3'>
                                <div className='flex items-center gap-2 text-white'>
                                    <div className='bg-white/20 p-1.5 rounded-lg'>
                                        <FaBook className='w-4 h-4' />
                                    </div>
                                    <span className='font-semibold'>Field of Study</span>
                                </div>
                            </div>
                            <div className='p-4'>
                                {scholarship.fieldOfStudy && scholarship.fieldOfStudy.includes("Open for All Courses") ? (
                                    <div className='flex justify-center items-center py-9'>
                                        <span className='bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full font-medium text-sm'>
                                            Open for All Courses
                                        </span>
                                    </div>
                                ) : (
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                                        {scholarship.fieldOfStudy.map((course, index) => (
                                            <div key={index} className='flex items-center gap-2 bg-blue-50 p-2 rounded-lg'>
                                                <div className='w-1.5 h-1.5 bg-blue-500 rounded-full'></div>
                                                <span className='text-gray-700 text-sm font-medium'>{course}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Info Cards */}
                        <div className='space-y-3'>
                            <div className='bg-white rounded-xl shadow-lg border border-blue-100 p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
                                <div className='flex items-center gap-2 mb-2'>
                                    <div className='bg-blue-100 p-1.5 rounded-lg'>
                                        <FaMapMarkerAlt className='text-blue-600 w-4 h-4' />
                                    </div>
                                    <span className='font-semibold text-gray-700 text-sm'>Location</span>
                                </div>
                                <p className='text-gray-600 font-medium text-sm'>{scholarship.location}</p>
                            </div>

                            <div className='bg-white rounded-xl shadow-lg border border-blue-100 p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
                                <div className='flex items-center gap-2 mb-2'>
                                    <div className='bg-blue-100 p-1.5 rounded-lg'>
                                        <FaGraduationCap className='text-blue-600 w-4 h-4' />
                                    </div>
                                    <span className='font-semibold text-gray-700 text-sm'>Education Level</span>
                                </div>
                                <p className='text-gray-600 font-medium text-sm'>{scholarship.educationLevel}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status and Deadline Cards */}
                <div className='max-w-6xl mx-auto px-4 lg:px-6 mb-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        <div className='bg-white rounded-xl shadow-lg border border-blue-100 p-4 hover:shadow-xl transition-all duration-300'>
                            <div className='flex items-center gap-2 mb-2'>
                                <div className='bg-blue-100 p-1.5 rounded-lg'>
                                    <MdOutlineRefresh className='w-4 h-4 text-blue-600' />
                                </div>
                                <span className='font-semibold text-gray-700 text-sm'>Last Updated</span>
                            </div>
                            <p className='text-blue-600 font-bold text-sm'>{formatDate(scholarship.dateUpdated)}</p>
                        </div>

                        <div className='bg-white rounded-xl shadow-lg border border-red-100 p-4 hover:shadow-xl transition-all duration-300'>
                            <div className='flex items-center gap-2 mb-2'>
                                <div className='bg-red-100 p-1.5 rounded-lg'>
                                    <FaRegCalendarXmark className='w-4 h-4 text-red-600' />
                                </div>
                                <span className='font-semibold text-gray-700 text-sm'>Application Deadline</span>
                            </div>
                            <p className='text-red-600 font-bold text-sm'>{formatDate(scholarship.applicationDeadline)}</p>
                        </div>

                        <div className='bg-white rounded-xl shadow-lg border border-green-100 p-4 hover:shadow-xl transition-all duration-300 md:col-span-2 lg:col-span-1'>
                            <div className='flex items-center gap-2 mb-2'>
                                <div className='bg-green-100 p-1.5 rounded-lg'>
                                    <FaPersonCirclePlus className='w-4 h-4 text-green-600' />
                                </div>
                                <span className='font-semibold text-gray-700 text-sm'>Available Slots</span>
                            </div>
                            <div className='flex items-center gap-1 mb-2'>
                                <span className='text-lg font-bold text-green-600'>{scholarship.approvedScholars}</span>
                                <span className='text-gray-400'>/</span>
                                <span className='text-lg font-bold text-blue-600'>{scholarship.numberOfScholarships}</span>
                            </div>
                            <div className='w-full bg-gray-200 rounded-full h-1.5'>
                                <div
                                    className='bg-gradient-to-r from-green-500 to-blue-500 h-1.5 rounded-full transition-all duration-500'
                                    style={{ width: `${(scholarship.approvedScholars / scholarship.numberOfScholarships) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Banner and Content Section */}
                <div className='max-w-6xl mx-auto px-4 lg:px-6 mb-8'>
                    {/* Banner Image */}
                    <div className='relative rounded-xl overflow-hidden shadow-lg mb-6 group'>
                        <div className='aspect-video bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center'>
                            {scholarship.bannerImage ? (
                                <img
                                    src={scholarship.bannerImage}
                                    alt="Scholarship Banner"
                                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-700'
                                />
                            ) : (
                                <div className='text-center'>
                                    <FaGraduationCap className='w-12 h-12 text-blue-400 mx-auto mb-2' />
                                    <span className='text-blue-600 font-semibold'>Scholarship Banner</span>
                                </div>
                            )}
                        </div>
                        <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                    </div>

                    {/* Content Sections */}
                    <div className='space-y-6'>
                        {scholarship.description && (
                            <div className='bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden hover:shadow-xl transition-all duration-300'>
                                <div className='bg-gradient-to-r from-blue-600 to-blue-700 p-4'>
                                    <h2 className='text-lg font-bold text-white'>Description</h2>
                                </div>
                                <div className='p-4'>
                                    <div className='prose prose-blue max-w-none'>
                                        <p className='text-gray-700 text-sm leading-relaxed whitespace-pre-line'>{scholarship.description}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {scholarship.sections && scholarship.sections.length > 0 && (
                            scholarship.sections.map((section, index) => (
                                <div key={index} className='bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden hover:shadow-xl transition-all duration-300'>
                                    <div className='bg-gradient-to-r from-blue-600 to-blue-700 p-4'>
                                        <h2 className='text-lg font-bold text-white'>{section.title}</h2>
                                    </div>
                                    <div className='p-4'>
                                        <div className='prose prose-blue max-w-none'>
                                            <p className='text-gray-700 text-sm leading-relaxed whitespace-pre-line'>{section.content}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* FAQ and Contact Section */}
                <div className='max-w-6xl mx-auto px-4 lg:px-6 mb-8'>
                    <div className='bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden'>
                        <div className='bg-gradient-to-r from-blue-600 to-blue-700 p-4'>
                            <h2 className='text-lg font-bold text-white'>{scholarship.faqTitle}</h2>
                        </div>
                        <div className='p-4'>
                            <div className='prose prose-blue max-w-none mb-6'>
                                <p className='text-gray-700 text-sm leading-relaxed whitespace-pre-line'>{scholarship.faqDescription}</p>
                            </div>

                            <div className='border-t border-gray-200 pt-6'>
                                <h3 className='text-lg font-semibold text-center text-gray-700 mb-6'>Have more questions? Get in touch!</h3>

                                {/* Contact Cards */}
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                    <div className='group bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer'>
                                        <div className='flex items-center gap-3'>
                                            <div className='bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                                                <FaEnvelope className='text-white w-4 h-4' />
                                            </div>
                                            <div className='flex-1'>
                                                <h4 className='font-semibold text-blue-800 mb-1 text-sm'>Email us!</h4>
                                                <p className='text-blue-600 text-xs break-words'>{scholarship.contactEmail}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='group bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer'>
                                        <div className='flex items-center gap-3'>
                                            <div className='bg-green-600 w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                                                <FaPhone className='text-white w-4 h-4' />
                                            </div>
                                            <div className='flex-1'>
                                                <h4 className='font-semibold text-green-800 mb-1 text-sm'>Call us!</h4>
                                                <p className='text-green-600 text-xs break-words'>{scholarship.contactPhone}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='group bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer md:col-span-2 lg:col-span-1'>
                                        <Link to={`/profile/${scholarship.providerId}`} className='flex items-center gap-3'>
                                            <div className='bg-purple-600 w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                                                <FaUser className='text-white w-4 h-4' />
                                            </div>
                                            <div className='flex-1'>
                                                <h4 className='font-semibold text-purple-800 mb-1 text-sm'>Visit our profile!</h4>
                                                <p className='text-purple-600 text-xs break-words'>{scholarship.organizationName}</p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ready to Apply Section */}
                <div className='max-w-6xl mx-auto px-4 lg:px-6 mb-8'>
                    <div className='bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200'>
                        <div className='text-center mb-6'>
                            <h2 className='text-2xl font-bold text-blue-800 mb-2'>Ready to Apply?</h2>
                            <p className='text-blue-600'>Take the next step towards your educational goals!</p>
                        </div>

                        <div className='flex justify-center'>
                            <div
                                onClick={handleApplyClick}
                                className='group cursor-pointer bg-white border-2 border-blue-300 rounded-xl p-4 hover:shadow-lg hover:-translate-y-2 hover:border-blue-500 transition-all duration-300 w-full max-w-md'
                            >
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-3'>
                                        <div className='bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                                            <img src={NewLogo} alt="HubIsko Logo" className='w-8 h-8 object-cover rounded-lg' />
                                        </div>
                                        <div>
                                            <h3 className='text-lg font-bold text-blue-800 group-hover:text-blue-900'>Apply with HubIsko!</h3>
                                            <p className='text-blue-600 text-sm'>We'll guide you step by step!</p>
                                        </div>
                                    </div>
                                    <FaArrowRightLong className='w-6 h-6 text-blue-600 group-hover:translate-x-1 group-hover:text-blue-800 transition-all duration-300' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />

            {notification && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='relative p-10 bg-white rounded-md text-center shadow-lg font-medium'>
                        <button onClick={() => setNotification('')} className='absolute top-2 right-2'>
                            <div className='border rounded-full p-1 hover:bg-slate-200'>
                                <CgClose className='w-4 h-4' />
                            </div>
                        </button>
                        {notification === 'You must be logged in to apply for scholarships.' && (
                            <>
                                <strong className='font-bold text-red-500 text-lg'>Not Logged In!</strong>
                                <div className='text-slate-400' role='alert'>
                                    <span className='block sm:inline font-medium'>{notification}</span>
                                </div>
                                <div className='flex flex-col justify-center w-full gap-2 mt-4'>
                                    <Link to='/login' className='bg-blue-600 text-white text-center rounded-md w-full hover:bg-blue-800 py-2'>Login</Link>
                                    <div className=''>
                                        <div className='border mt-5'></div>
                                        <div className='w-full -translate-y-4 text-center'>
                                            <span className='bg-white px-5 text-slate-500 font-medium'>or</span>
                                        </div>
                                    </div>
                                    <div className='w-full flex gap-2 justify-between'>
                                        <Link to='/register' className='bg-blue-800 text-white text-center rounded-md w-full hover:bg-blue-800 py-2'>Register</Link>
                                    </div>
                                </div>
                            </>
                        )}
                        {notification === 'Your account is currently under verification. You cannot apply for scholarships until your account is fully verified.' && (
                            <>
                                <div className="flex items-center justify-center mb-4">
                                    <svg className="h-6 w-6 text-yellow-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                                    </svg>
                                    <strong className="font-bold text-yellow-500 text-lg">Pending Verification!</strong>
                                </div>
                                <div className="text-slate-400" role="alert">
                                    <span className="block sm:inline font-medium">{notification}</span>
                                </div>
                            </>
                        )}
                        {notification === 'You need to verify your account before applying for scholarships. Please visit the verification page.' && (
                            <>
                                <div className="flex items-center justify-center mb-4">
                                    <svg className="h-6 w-6 text-yellow-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                                    </svg>
                                    <strong className="font-bold text-yellow-500 text-lg">Verify Account!</strong>
                                </div>
                                <div className="text-slate-400" role="alert">
                                    <span className="block sm:inline font-medium">{notification}</span>
                                </div>
                                <button
                                    onClick={() => navigate('/verify-profile')}
                                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                                >
                                    Verify Profile
                                </button>
                            </>
                        )}
                        {notification !== 'You must be logged in to apply for scholarships.' && notification !== 'Your account is currently under verification. You cannot apply for scholarships until your account is fully verified.' && notification !== 'You need to verify your account before applying for scholarships. Please visit the verification page.' && (
                            <>
                                <div className='text-slate-400 flex items-center justify-center' role='alert'>
                                    <span className='block sm:inline font-medium'>{notification}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {notification2 && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='p-6 pb-10 bg-white rounded-md text-center shadow-lg font-medium'>
                        <button onClick={() => setNotification2('')} className='flex w-full justify-end items-end'>
                            <div className='border rounded-full p-1 hover:bg-slate-200'>
                                <CgClose className='w-4 h-4' />
                            </div>
                        </button>
                        <strong className='font-bold text-red-500 text-lg'>Already Applied!</strong>
                        <div className='text-slate-400 ' role='alert'>
                            <span className='block sm:inline font-medium'>{notification2}</span>
                        </div>
                        <Link to='/scholar-dashboard' className='mt-4 inline-block bg-blue-600 text-white text-center rounded-md w-full hover:bg-blue-800 py-2'>
                            Go to Scholar Dashboard
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}