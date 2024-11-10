import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserSuccess } from '../redux/user/userSlice'; // Adjust the import path as needed
import { useNavigate } from 'react-router-dom';
import { regions, provinces, cities, barangays } from 'select-philippines-address';
import { storage } from '../firebase'; // Import Firebase storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import necessary Firebase functions
import useTokenExpiry from '../hooks/useTokenExpiry'; // Adjust the import path
import CustomNotification from '../components/CustomNotification'; // Adjust the import path

export default function CompleteProfile() {
  useTokenExpiry();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    profilePicture: '',
    firstName: '',
    middleName: '',
    lastName: '',
    nameExtension: '',
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
    addressDetails: '',
    region: '',
    province: '',
    city: '',
    barangay: '',
    education: {
      elementary: {
        school: '',
        award: '',
        yearGraduated: '',
      },
      juniorHighSchool: {
        school: '',
        award: '',
        yearGraduated: '',
      },
      seniorHighSchool: {
        school: '',
        award: '',
        yearGraduated: '',
      },
      college: {
        school: '',
        course: '',
        yearGraduated: ''
      }
    },
    studentIdFile: '',
    certificateOfRegistrationFile: '',
  });

  useEffect(() => {
    if (currentUser && currentUser.profilePicture) {
      setFormData(prevFormData => ({
        ...prevFormData,
        profilePicture: currentUser.profilePicture
      }));
    }
  }, [currentUser]);

  const handleNext = () => {
    console.log('Current civilStatus:', formData.civilStatus);

    const stepRequiredFields = {
      1: [
        'firstName', 'lastName', 'birthdate', 'gender',
        'bloodType', 'civilStatus', ...(formData.civilStatus === 'Married' ?
          ['maidenName', 'spouseName', 'spouseOccupation'] : []),
        'religion', 'height', 'weight', 'birthplace', 'contactNumber',
        'region', 'province', 'city', 'barangay', 'addressDetails'
      ],
      2: [
        'education.elementary.school', 'education.elementary.award',
        'education.elementary.yearGraduated', 'education.juniorHighSchool.school',
        'education.juniorHighSchool.award', 'education.juniorHighSchool.yearGraduated',
        'education.seniorHighSchool.school', 'education.seniorHighSchool.award',
        'education.seniorHighSchool.yearGraduated', 'education.college.school',
        'education.college.course'
      ],
      3: ['studentIdFile', 'certificateOfRegistrationFile']
    };

    const fieldDisplayNames = {
      firstName: 'First Name', lastName: 'Last Name',
      birthdate: 'Birthdate', gender: 'Gender', bloodType: 'Blood Type',
      civilStatus: 'Civil Status', religion: 'Religion', height: 'Height', weight: 'Weight',
      birthplace: 'Birthplace', contactNumber: 'Contact Number', addressDetails: 'Address Details',
      maidenName: 'Maiden Name', spouseName: 'Name of Spouse', spouseOccupation: 'Occupation of Spouse',
      region: 'Region Name', province: 'Province Name', city: 'City Name', barangay: 'Barangay Name',
      'education.elementary.school': 'Elementary School', 'education.elementary.award': 'Elementary Award',
      'education.elementary.yearGraduated': 'Elementary Year Graduated',
      'education.juniorHighSchool.school': 'Junior High School', 'education.juniorHighSchool.award': 'Junior High Award',
      'education.juniorHighSchool.yearGraduated': 'Junior High Year Graduated', 'education.seniorHighSchool.school': 'Senior High School',
      'education.seniorHighSchool.award': 'Senior High Award', 'education.seniorHighSchool.yearGraduated': 'Senior High Year Graduated',
      'education.college.school': 'College School', 'education.college.course': 'College Course',
      studentIdFile: 'Student ID Image', certificateOfRegistrationFile: 'Certificate of Registration Image'
    };

    const requiredFields = stepRequiredFields[currentStep];
    const missingFields = requiredFields.filter(field => {
      const keys = field.split('.');
      let value = formData;
      for (const key of keys) {
        value = value[key];
        if (value === undefined || value === '') {
          return true;
        }
      }
      return false;
    });

    const isBirthdateValid = new Date(formData.birthdate) <= new Date(maxDate);

    const isContactNumberValid = /^09\d{9}$/.test(formData.contactNumber);

    if (missingFields.length === 0 && isBirthdateValid && isContactNumberValid) {
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      let message = '';
      if (missingFields.length > 0) {
        const topMostMissingField = missingFields[0];
        const topMostMissingFieldName = fieldDisplayNames[topMostMissingField];
        message = `The following required field is missing: ${topMostMissingFieldName}. Please complete it before proceeding to the next step.`;
      } else if (!isBirthdateValid) {
        message = 'The birthdate entered is invalid. Please enter a valid birthdate before proceeding to the next step.';
      } else if (!isContactNumberValid) {
        message = 'The contact number entered is invalid. Please enter a valid 11-digit phone number starting with 09.';
      }
      setNotification({
        show: true,
        message: message
      });
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/user/details')
      .then((response) => response.json())
      .then((data) => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          firstName: data.applicantDetails.firstName || '',
          lastName: data.applicantDetails.lastName || '',
        }));
      })
      .catch((error) => console.error('Error fetching user details:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const isSingleWidowedOrDivorced = ['Single', 'Widowed', 'Divorced', ''].includes(formData.civilStatus);

  useEffect(() => {
    if (isSingleWidowedOrDivorced) {
      setFormData((prevData) => ({
        ...prevData,
        maidenName: '',
        spouseName: '',
        spouseOccupation: ''
      }));
    }
  }, [formData.civilStatus, isSingleWidowedOrDivorced]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // List of required fields
    const requiredFields = [
      'firstName',
      'lastName',
      'birthdate',
      'gender',
      'bloodType',
      'civilStatus',
      'religion',
      'height',
      'weight',
      'birthplace',
      'contactNumber',
      'addressDetails',
      'barangay',
      'city',
      'province',
      'region',
      // Added education fields
      'education.elementary.school',
      'education.elementary.award',
      'education.elementary.yearGraduated',
      'education.juniorHighSchool.school',
      'education.juniorHighSchool.award',
      'education.juniorHighSchool.yearGraduated',
      'education.seniorHighSchool.school',
      'education.seniorHighSchool.award',
      'education.seniorHighSchool.yearGraduated',
      'education.college.school',
      'education.college.course',
      'studentIdFile',
      'certificateOfRegistrationFile'
    ];

    // Mapping of field keys to display names
    const fieldDisplayNames = {
      firstName: 'First Name',
      lastName: 'Last Name',
      birthdate: 'Birthdate',
      gender: 'Gender',
      bloodType: 'Blood Type',
      civilStatus: 'Civil Status',
      religion: 'Religion',
      height: 'Height',
      weight: 'Weight',
      birthplace: 'Birthplace',
      contactNumber: 'Contact Number',
      addressDetails: 'Address Details',
      barangay: 'Barangay Name',
      city: 'City Name',
      province: 'Province Name',
      region: 'Region Name',
      // Added education fields
      'education.elementary.school': 'Elementary School',
      'education.elementary.award': 'Elementary Award',
      'education.elementary.yearGraduated': 'Elementary Year Graduated',
      'education.juniorHighSchool.school': 'Junior High School',
      'education.juniorHighSchool.award': 'Junior High Award',
      'education.juniorHighSchool.yearGraduated': 'Junior High Year Graduated',
      'education.seniorHighSchool.school': 'Senior High School',
      'education.seniorHighSchool.award': 'Senior High Award',
      'education.seniorHighSchool.yearGraduated': 'Senior High Year Graduated',
      'education.college.school': 'College School',
      'education.college.course': 'College Course',
      studentIdFile: 'Student ID Image',
      certificateOfRegistrationFile: 'Certificate of Registration Image',
    };

    // Check if all required fields are filled and collect missing fields
    const missingFields = requiredFields.filter(field => {
      const keys = field.split('.');
      let value = formData;
      for (const key of keys) {
        value = value[key];
        if (value === undefined || value === '') {
          return true;
        }
      }
      return false;
    });

    // Log formData to the console
    console.log('Form Data:', formData);

    if (missingFields.length === 0) {
      setShowModal(true); // Show modal when form is submitted
      document.body.classList.add('modal-open'); // Add class to body to prevent scrolling
    } else {
      const missingFieldNames = missingFields.map(field => fieldDisplayNames[field]);
      setNotification({
        show: true,
        message: `The following required fields are missing: ${missingFieldNames.join(', ')}. Please complete them before submitting the form.`
      });
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmSubmit = async () => {
    setIsLoading(true);

    let profilePictureUrl = '';
    let studentIdFileUrl = '';
    let certificateOfRegistrationFileUrl = '';

    try {
      // Upload profile picture if it exists
      if (formData.profilePicture && formData.profilePicture instanceof Blob) {
        const storageRef = ref(storage, `profilePictures/${formData.profilePicture.name}`);
        await uploadBytes(storageRef, formData.profilePicture);
        profilePictureUrl = await getDownloadURL(storageRef);
      } else {
        profilePictureUrl = formData.profilePicture; // Use existing URL if it's not a Blob
      }

      // Upload student ID file if it exists
      if (formData.studentIdFile) {
        const studentIdRef = ref(storage, `studentIdFiles/${formData.studentIdFile.name}`);
        await uploadBytes(studentIdRef, formData.studentIdFile);
        studentIdFileUrl = await getDownloadURL(studentIdRef);
      }

      // Upload certificate of registration file if it exists
      if (formData.certificateOfRegistrationFile) {
        const certificateOfRegistrationRef = ref(storage, `certificateOfRegistrationFiles/${formData.certificateOfRegistrationFile.name}`);
        await uploadBytes(certificateOfRegistrationRef, formData.certificateOfRegistrationFile);
        certificateOfRegistrationFileUrl = await getDownloadURL(certificateOfRegistrationRef);
      }

      const updatedFormData = {
        ...formData,
        profilePicture: profilePictureUrl,
        studentIdFile: studentIdFileUrl, // Include the student ID file URL
        certificateOfRegistrationFile: certificateOfRegistrationFileUrl, // Include the certificate of registration file URL
      };
      console.log('Updated form data:', updatedFormData);

      const response = await fetch('/api/user/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const data = await response.json();
      console.log('Success:', data);

      // Update the currentUser state in Redux
      dispatch(updateUserSuccess({
        ...currentUser,
        applicantDetails: {
          ...currentUser.applicantDetails,
          profileComplete: true,
          profilePicture: profilePictureUrl,
        },
        profilePicture: profilePictureUrl, // Update the profilePicture in currentUser
        studentIdFile: studentIdFileUrl, // Update the studentIdFile in currentUser
        certificateOfRegistrationFile: certificateOfRegistrationFileUrl, // Update the certificateOfRegistrationFile in currentUser
        status: 'Pending Verification', // Update the status to Pending verification
      }));

      navigate('/complete-profile-confirmation');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      profilePicture: file,
    });
  };


  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  const [regionList, setRegionList] = useState([]);
  const [provinceList, setProvinceList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [barangayList, setBarangayList] = useState([]);

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedBarangay, setSelectedBarangay] = useState('');

  const [regionName, setRegionName] = useState('');
  const [provinceName, setProvinceName] = useState('');
  const [cityName, setCityName] = useState('');
  const [barangayName, setBarangayName] = useState('');

  // Fetch all regions on component mount
  useEffect(() => {
    regions().then(setRegionList);
  }, []);

  // Fetch provinces when a region is selected
  useEffect(() => {
    if (selectedRegion) {
      console.log(`Selected Region: ${selectedRegion}`);
      provinces(selectedRegion).then(setProvinceList);
      regions().then((regionList) => {
        const region = regionList.find((r) => r.region_code === selectedRegion);
        const regionName = region ? region.region_name : '';
        setRegionName(regionName);
        setFormData(prevState => ({
          ...prevState,
          region: selectedRegion,
          regionName: regionName,
          province: '',
          provinceName: '',
          city: '',
          cityName: '',
          barangay: '',
          barangayName: ''
        }));
      });
    }
  }, [selectedRegion]);

  // Fetch cities when a province is selected
  useEffect(() => {
    if (selectedProvince) {
      console.log(`Selected Province: ${selectedProvince}`);
      cities(selectedProvince).then(setCityList);
      provinces(selectedRegion).then((provinceList) => {
        const province = provinceList.find((p) => p.province_code === selectedProvince);
        const provinceName = province ? province.province_name : '';
        setProvinceName(provinceName);
        setFormData(prevState => ({
          ...prevState,
          province: selectedProvince,
          provinceName: provinceName,
          city: '',
          cityName: '',
          barangay: '',
          barangayName: ''
        }));
      });
    }
  }, [selectedProvince]);

  // Fetch barangays when a city is selected
  useEffect(() => {
    if (selectedCity) {
      console.log(`Selected City: ${selectedCity}`);
      barangays(selectedCity).then(setBarangayList);
      cities(selectedProvince).then((cityList) => {
        const city = cityList.find((c) => c.city_code === selectedCity);
        const cityName = city ? city.city_name : '';
        setCityName(cityName);
        setFormData(prevState => ({
          ...prevState,
          city: selectedCity,
          cityName: cityName,
          barangay: '',
          barangayName: ''
        }));
      });
    }
  }, [selectedCity]);

  // Update formData when barangay is selected
  useEffect(() => {
    if (selectedBarangay) {
      console.log(`Selected Barangay: ${selectedBarangay}`);
      barangays(selectedCity).then((barangayList) => {
        const barangay = barangayList.find((b) => b.brgy_code === selectedBarangay);
        const barangayName = barangay ? barangay.brgy_name : '';
        setBarangayName(barangayName);
        setFormData(prevState => ({
          ...prevState,
          barangay: selectedBarangay,
          barangayName: barangayName
        }));
      });
    }
  }, [selectedBarangay]);

  // Load initial data from formData
  useEffect(() => {
    if (formData.region) {
      setSelectedRegion(formData.region);
    }
    if (formData.province) {
      setSelectedProvince(formData.province);
    }
    if (formData.city) {
      setSelectedCity(formData.city);
    }
    if (formData.barangay) {
      setSelectedBarangay(formData.barangay);
    }
  }, [formData]);

  const handleEducationChange = (e, level) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      education: {
        ...prevState.education,
        [level]: {
          ...prevState.education[level],
          [name]: value
        }
      }
    }));
  };

  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (validImageTypes.includes(file.type)) {
        setSelectedImage(URL.createObjectURL(file));
        setErrorMessage('');
        setFormData(prevFormData => ({
          ...prevFormData,
          studentIdFile: file // Store the file in formData
        }));
      } else {
        setErrorMessage('Invalid file type. Please upload a JPG, PNG, or GIF image.');
        setSelectedImage(null);
        setFormData(prevFormData => ({
          ...prevFormData,
          studentIdFile: null // Clear the file in formData
        }));
      }
    }
  };

  const [selectedCorImage, setSelectedCorImage] = useState(null);
  const [corErrorMessage, setCorErrorMessage] = useState('');

  const handleCorImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (validImageTypes.includes(fileType)) {
        setSelectedCorImage(URL.createObjectURL(file));
        setCorErrorMessage('');
        setFormData(prevFormData => ({
          ...prevFormData,
          certificateOfRegistrationFile: file // Store the file in formData
        }));
      } else {
        setCorErrorMessage('Invalid file type. Please upload an image file (JPG, PNG, GIF).');
      }
    }
  };

  const [showImageModal, setShowImageModal] = useState(false);

  const handleImageClick = () => {
    setShowImageModal(true);
  };

  const Datetoday = new Date();
  const maxDate = new Date(Datetoday.setFullYear(Datetoday.getFullYear() - 15)).toISOString().split('T')[0];

  const courses = [
    "BA in Anthropology",
    "BA in Art Studies",
    "BA in Communication",
    "BA in Development Communication",
    "BA in Economics",
    "BA in Fine Arts",
    "BA in Geography",
    "BA in History",
    "BA in International Relations",
    "BA in Journalism",
    "BA in Law",
    "BA in Linguistics",
    "BA in Media Studies",
    "BA in Religious Studies",
    "BA in Social Work",
    "BS in Accounting",
    "BS in Accounting Information Systems",
    "BS in Accounting Technology",
    "BS in Aerospace Engineering",
    "BS in Agribusiness Management",
    "BS in Agricultural Engineering",
    "BS in Agriculture",
    "BS in Animal Science",
    "BS in Applied Mathematics",
    "BS in Applied Physics",
    "BS in Architecture",
    "BS in Astronomy",
    "BS in Biochemistry",
    "BS in Biology",
    "BS in Biomedical Engineering",
    "BS in Biosystems Engineering",
    "BS in Business Administration",
    "BS in Business Administration major in Financial Management",
    "BS in Business Analytics",
    "BS in Business Management",
    "BS in Chemical Engineering",
    "BS in Chemistry",
    "BS in Civil Engineering",
    "BS in Communication",
    "BS in Computer Engineering",
    "BS in Computer Science",
    "BS in Criminology",
    "BS in Cyber Security",
    "BS in Data Analytics",
    "BS in Data Science",
    "BS in Dentistry",
    "BS in Digital Media Arts",
    "BS in Education",
    "BS in Electrical Engineering",
    "BS in Elementary Education",
    "BS in Electronics and Communications Engineering",
    "BS in Electronics Engineering",
    "BS in Environmental Engineering",
    "BS in Environmental Science",
    "BS in Fashion Design",
    "BS in Finance",
    "BS in Food Science",
    "BS in Food Technology",
    "BS in Forensic Science",
    "BS in Forestry",
    "BS in Geodetic Engineering",
    "BS in Geology",
    "BS in Graphic Design",
    "BS in Health Sciences",
    "BS in Horticulture",
    "BS in Hospitality Management",
    "BS in Hotel and Restaurant Management",
    "BS in Human Resource Development",
    "BS in Industrial Design",
    "BS in Industrial Engineering",
    "BS in Information Systems",
    "BS in Information Technology",
    "BS in Internal Auditing",
    "BS in Landscape Architecture",
    "BS in Library and Information Science",
    "BS in Management Accounting",
    "BS in Marine Biology",
    "BS in Marine Engineering",
    "BS in Marine Transportation",
    "BS in Marketing",
    "BS in Materials Science",
    "BS in Mathematics",
    "BS in Mechanical Engineering",
    "BS in Medical Laboratory Science",
    "BS in Medical Technology",
    "BS in Medicine",
    "BS in Metallurgical Engineering",
    "BS in Microbiology",
    "BS in Midwifery",
    "BS in Mining Engineering",
    "BS in Molecular Biology",
    "BS in Multimedia Arts",
    "BS in Music",
    "BS in Nanotechnology",
    "BS in Nursing",
    "BS in Nutrition",
    "BS in Occupational Therapy",
    "BS in Oceanography",
    "BS in Pharmacy",
    "BS in Physical Therapy",
    "BS in Physics",
    "BS in Political Science",
    "BS in Psychology",
    "BS in Public Health",
    "BS in Radiologic Technology",
    "BS in Real Estate Management",
    "BS in Renewable/Sustainable Energy Engineering",
    "BS in Robotics Engineering",
    "BS in Secondary Education major in Biology",
    "BS in Secondary Education major in Chemistry",
    "BS in Secondary Education major in English",
    "BS in Secondary Education major in General Sciences",
    "BS in Secondary Education major in Mathematics",
    "BS in Secondary Education major in Physics",
    "BS in Social Work",
    "BS in Sociology",
    "BS in Software Engineering",
    "BS in Statistics",
    "BS in Tourism Management",
    "BS in Veterinary Medicine",
    "BS in Zoology"
  ];

  const handleKeyPress = (event) => {
    const charCode = event.charCode;
    if ((charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
      event.preventDefault();
    }
  };

  return (
    <div className=' min-h-screen flex flex-col items-center'>
      {notification.show && (
        <CustomNotification
          message={notification.message}
          onClose={() => setNotification({ show: false, message: '' })}
        />
      )}
      <div className="flex justify-center pt-8 rounded-md">
        <h2 className="text-base lg:text-xl font-medium ">
          Please fill out the areas for student validation
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="max-w-6xl w-full mx-auto space-y-6 text-sm lg:text-base bg-white lg:border rounded-lg shadow-2xl mt-4 mb-10">
        {currentStep === 1 && (
          <div>
            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
              <span className='text-lg font-bold'>Basic Information</span>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4'>
              <div className='col-span-1 md:col-span-2 lg:col-span-4 text-center mt-2'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Profile Picture <span className='text-gray-500'>(optional)</span>
                </label>
                <span className='text-xs text-gray-500 mb-2 block'>Upload a square image for best results.</span>
                <div className='flex justify-center'>
                  <div className='relative'>
                    <input
                      type="file"
                      id="profilePictureInput"
                      name="profilePicture"
                      accept="image/*"
                      onChange={(e) => {
                        handleFileChange(e);
                        e.target.setCustomValidity('');
                      }}
                      onInvalid={(e) => e.target.setCustomValidity('')}
                      className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                    />
                    <div className='w-24 h-24 rounded-full border border-gray-300 flex items-center justify-center overflow-hidden'>
                      <img
                        src={
                          formData.profilePicture instanceof Blob
                            ? URL.createObjectURL(formData.profilePicture)
                            : formData.profilePicture || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToiRnzzyrDtkmRzlAvPPbh77E-Mvsk3brlxQ&s'
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  First Name <span className='text-red-500'>*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your first name"
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Last Name <span className='text-red-500'>*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your last name"
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Middle Name <span className='text-red-500'>*</span>
                </label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your middle name"
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Name Extension</label>
                <select
                  name="nameExtension"
                  value={formData.nameExtension}
                  onChange={handleChange}
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                >
                  <option value="">Select Name Ext. (if applicable)</option>
                  <option value="Jr.">Jr.</option>
                  <option value="Sr.">Sr.</option>
                  <option value="II">II</option>
                  <option value="III">III</option>
                  <option value="IV">IV</option>
                  <option value="V">V</option>
                </select>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 mt-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Birthdate <span className='text-red-500'>*</span></label>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  required
                  max={maxDate} // Set the max attribute to the calculated date
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Gender <span className='text-red-500'>*</span></label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Blood Type <span className='text-red-500'>*</span></label>
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  required
                >
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="unknown">I don't know</option> {/* Added option for unknown blood type */}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Civil Status <span className='text-red-500'>*</span></label>
                <select
                  name="civilStatus"
                  value={formData.civilStatus}
                  onChange={handleChange}
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  required
                >
                  <option value="">Select Civil Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>

              {!isSingleWidowedOrDivorced && (
                <>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Maiden Name <span className='text-red-500'>*</span></label>
                    <input
                      type="text"
                      name="maidenName"
                      value={formData.maidenName}
                      onChange={handleChange}
                      placeholder="Enter maiden name"
                      disabled={isSingleWidowedOrDivorced}
                      required
                      className={`standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full ${isSingleWidowedOrDivorced ? 'text-gray-400' : ''}`}
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Name of Spouse <span className='text-red-500'>*</span></label>
                    <input
                      type="text"
                      name="spouseName"
                      value={formData.spouseName}
                      onChange={handleChange}
                      placeholder="Enter name of spouse"
                      disabled={isSingleWidowedOrDivorced}
                      required
                      className={`standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full ${isSingleWidowedOrDivorced ? 'text-gray-400' : ''}`}
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Occupation of Spouse <span className='text-red-500'>*</span></label>
                    <input
                      type="text"
                      name="spouseOccupation"
                      value={formData.spouseOccupation}
                      onChange={handleChange}
                      placeholder="Enter occupation of spouse"
                      disabled={isSingleWidowedOrDivorced}
                      required
                      className={`standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full ${isSingleWidowedOrDivorced ? 'text-gray-400' : ''}`}
                    />
                  </div>
                </>
              )}

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Religion <span className='text-red-500'>*</span></label>
                <input
                  type="text"
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                  placeholder="Enter your religion"
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Height <span className='text-red-500'>*</span></label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  placeholder="Enter height in cm"
                  required
                  min="0" // Set the min attribute to 0
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Weight <span className='text-red-500'>*</span></label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  placeholder="Enter weight in kg"
                  required
                  min="0" // Set the min attribute to 0
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Birthplace <span className='text-red-500'>*</span></label>
                <input
                  type="text"
                  name="birthplace"
                  value={formData.birthplace}
                  onChange={handleChange}
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  placeholder="Enter birthplace"
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Contact Number <span className='text-red-500'>*</span></label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  placeholder="Enter contact number"
                  maxLength="11"
                  inputMode="numeric"
                  pattern="09\d{9}"
                  title="Please enter a valid 11-digit phone number starting with 09"
                  required
                />
              </div>

            </div>

            <div className='grid grid-cols-2 gap-4 px-4 mt-4'>
              {/* Region Selector */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Region <span className='text-red-500'>*</span></label>
                <select
                  value={selectedRegion}
                  onChange={(e) => {
                    setSelectedRegion(e.target.value);
                    setProvinceList([]); // Reset on region change
                    setCityList([]);
                    setBarangayList([]);
                  }}
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  required
                >
                  <option value="">Select Region</option>
                  {regionList.map((region) => (
                    <option key={region.region_code} value={region.region_code}>
                      {region.region_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Province Selector */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Province <span className='text-red-500'>*</span></label>
                <select
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setCityList([]);
                    setBarangayList([]);
                  }}
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  required
                >
                  <option value="">Select Province</option>
                  {provinceList.map((province) => (
                    <option key={province.province_code} value={province.province_code}>
                      {province.province_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Selector */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>City/Municipality <span className='text-red-500'>*</span></label>
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setBarangayList([]);
                  }}
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  required
                >
                  <option value="">Select City</option>
                  {cityList.map((city) => (
                    <option key={city.city_code} value={city.city_code}>
                      {city.city_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Barangay Selector */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Barangay <span className='text-red-500'>*</span></label>
                <select
                  value={selectedBarangay}
                  onChange={(e) => setSelectedBarangay(e.target.value)}
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  required
                >
                  <option value="">Select Barangay</option>
                  {barangayList.map((barangay) => (
                    <option key={barangay.brgy_code} value={barangay.brgy_code}>
                      {barangay.brgy_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Address Details */}
              <div className='w-full flex flex-col lg:col-span-1 mb-4'>
                <label className='hidden lg:block text-sm font-medium text-gray-700 mb-2'>
                  House No./Unit No./Bldg/Floor, Street, Subdivision <span className='text-red-500'>*</span>
                </label>
                <label className='block lg:hidden text-sm font-medium text-gray-700 mb-2'>
                  Full Address
                </label>
                <input
                  type="text"
                  name="addressDetails"
                  value={formData.addressDetails}
                  onChange={handleChange}
                  className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  placeholder="Enter House No./Unit No./Bldg/Floor, Street, Subdivision"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 px-4 py-4">
              <button
                onClick={handleNext}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="step-container">
            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
              <span className='text-lg font-bold'>Educational Information</span>
            </div>

            <div className='p-4 education-form'>
              {/* Elementary */}
              <span className='text-lg font-bold block'>Elementary</span>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    School <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type="text"
                    name="school"
                    value={formData.education.elementary.school}
                    onChange={(e) => handleEducationChange(e, 'elementary')}
                    required
                    placeholder="Enter elementary school name"
                    className='standard-input border border-gray-300 rounded-md p-2 w-full'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Award <span className='text-red-500'>*</span> <span className='text-xs text-gray-500'>(Type N/A if not applicable)</span>
                  </label>
                  <input
                    type="text"
                    name="award"
                    value={formData.education.elementary.award}
                    onChange={(e) => handleEducationChange(e, 'elementary')}
                    required
                    placeholder="Enter elementary award"
                    className='standard-input border border-gray-300 rounded-md p-2 w-full'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Year Graduated <span className='text-red-500'>*</span>
                  </label>
                  <select
                    name="yearGraduated"
                    value={formData.education.elementary.yearGraduated}
                    onChange={(e) => handleEducationChange(e, 'elementary')}
                    required
                    className='standard-input border border-gray-300 rounded-md p-2 w-full'
                  >
                    <option value="">Select year</option>
                    {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Junior High School */}
              <span className='text-lg font-bold mt-8 block'>Junior High School</span>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    School <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type="text"
                    name="school"
                    value={formData.education.juniorHighSchool.school}
                    onChange={(e) => handleEducationChange(e, 'juniorHighSchool')}
                    required
                    placeholder="Enter junior high school name"
                    className='standard-input border border-gray-300 rounded-md p-2 w-full'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Award <span className='text-red-500'>*</span> <span className='text-xs text-gray-500'>(Type N/A if not applicable)</span>
                  </label>
                  <input
                    type="text"
                    name="award"
                    value={formData.education.juniorHighSchool.award}
                    onChange={(e) => handleEducationChange(e, 'juniorHighSchool')}
                    required
                    placeholder="Enter junior high school award"
                    className='standard-input border border-gray-300 rounded-md p-2 w-full'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Year Graduated <span className='text-red-500'>*</span>
                  </label>
                  <select
                    name="yearGraduated"
                    value={formData.education.juniorHighSchool.yearGraduated}
                    onChange={(e) => handleEducationChange(e, 'juniorHighSchool')}
                    required
                    className='standard-input border border-gray-300 rounded-md p-2 w-full'
                  >
                    <option value="">Select year</option>
                    {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Senior High School */}
              <span className='text-lg font-bold mt-8 block'>Senior High School</span>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    School <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type="text"
                    name="school"
                    value={formData.education.seniorHighSchool.school}
                    onChange={(e) => handleEducationChange(e, 'seniorHighSchool')}
                    required
                    placeholder="Enter senior high school name"
                    className='standard-input border border-gray-300 rounded-md p-2 w-full'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Award <span className='text-red-500'>*</span> <span className='text-xs text-gray-500'>(Type N/A if not applicable)</span>
                  </label>
                  <input
                    type="text"
                    name="award"
                    value={formData.education.seniorHighSchool.award}
                    onChange={(e) => handleEducationChange(e, 'seniorHighSchool')}
                    required
                    placeholder="Enter senior high school award"
                    className='standard-input border border-gray-300 rounded-md p-2 w-full'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Year Graduated <span className='text-red-500'>*</span>
                  </label>
                  <select
                    name="yearGraduated"
                    value={formData.education.seniorHighSchool.yearGraduated}
                    onChange={(e) => handleEducationChange(e, 'seniorHighSchool')}
                    required
                    className='standard-input border border-gray-300 rounded-md p-2 w-full'
                  >
                    <option value="">Select year</option>
                    {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* College */}
              <span className='text-lg font-bold mt-8 block'>College</span>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    College <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type="text"
                    name="school"
                    value={formData.education.college.school}
                    onChange={(e) => handleEducationChange(e, 'college')}
                    required
                    placeholder="Enter college name"
                    className='standard-input border border-gray-300 rounded-md p-2 w-full'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    College Course <span className='text-red-500'>*</span>
                  </label>
                  <select
                    name="course"
                    value={formData.education.college.course}
                    onChange={(e) => handleEducationChange(e, 'college')}
                    required
                    className='standard-input border border-gray-300 rounded-md p-2 w-full'
                  >
                    <option value="" disabled>Select your course</option>
                    {courses.map((course) => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>

                {/* <div>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>College Year Graduated</label>
                                            <select
                                                name="yearGraduated"
                                                value={formData.education.college.yearGraduated}
                                                onChange={(e) => handleEducationChange(e, 'college')}
                                                className='standard-input border border-gray-300 rounded-md p-2 w-full'
                                            >
                                                <option value="">Select year</option>
                                                {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                                <option key={year} value={year}>{year}</option>
                                                ))}
                                            </select>
                                            </div> */}
              </div>
            </div>
            <div className="flex justify-end space-x-2 px-4 py-4">
              <button
                onClick={handlePrevious}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="step-container">
            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
              <span className='text-lg font-bold'>Upload Student ID</span>
            </div>
            {/* Step 3 content here */}
            <div className="p-4 flex flex-col items-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Student ID Image
              </label>
              <p className="text-gray-500 text-sm mb-4 text-center">
                Please upload a clear image of your student ID. Accepted formats are JPG, PNG, and GIF.
              </p>
              <div className="mt-1 flex flex-col items-center">
                <label className="relative bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50" title="Click to choose a file">
                  <span>Choose File</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
                {errorMessage && (
                  <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                )}
                {selectedImage ? (
                  <div className="mt-4">
                    <img src={selectedImage} alt="Selected" className="max-w-xs rounded border border-gray-300" />
                  </div>
                ) : (
                  <div className="mt-4 w-full max-w-xs h-40 flex items-center justify-center border-2 border-dashed border-gray-300 rounded">
                    <span className="text-gray-500">No image selected</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 flex flex-col items-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload School Certificate of Registration (COR) Image
              </label>
              <p className="text-gray-500 text-sm mb-4 text-center">
                Please upload a clear image of your School Certificate of Registration. Accepted formats are JPG, PNG, and GIF.
              </p>
              <div className="mt-1 flex flex-col items-center">
                <label className="relative bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50" title="Click to choose a file">
                  <span>Choose File</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCorImageChange}
                  />
                </label>
                {corErrorMessage && (
                  <p className="text-red-500 text-sm mt-2">{corErrorMessage}</p>
                )}
                {selectedCorImage ? (
                  <div className="mt-4">
                    <img src={selectedCorImage} alt="Selected COR" className="max-w-xs rounded border border-gray-300" />
                  </div>
                ) : (
                  <div className="mt-4 w-full max-w-xs h-40 flex items-center justify-center border-2 border-dashed border-gray-300 rounded">
                    <span className="text-gray-500">No image selected</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 px-4 py-4">
              <button
                onClick={handlePrevious}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                Previous
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </form>


      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center h-screen bg-gray-500 bg-opacity-50">
          <div className="relative w-full max-w-5xl">
            <div className="bg-white rounded-lg shadow-lg p-6 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Confirm Submission</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">Please review the information below carefully before submitting.</p>
              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-xl font-semibold text-white mb-4 border-b-2 border-gray-300 pb-2 bg-blue-600 p-2 rounded-md">Basic Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-md shadow-sm sm:col-span-2 flex flex-col items-center">
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-semibold">Profile Picture:</span>
                        </p>
                        <div className="w-24 h-24 rounded-full border border-gray-300 flex items-center justify-center overflow-hidden">
                          <img
                            src={
                              formData.profilePicture instanceof Blob
                                ? URL.createObjectURL(formData.profilePicture)
                                : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToiRnzzyrDtkmRzlAvPPbh77E-Mvsk3brlxQ&s'
                            }
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">First Name:</span> {formData.firstName}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Middle Name:</span> {formData.middleName}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Last Name:</span> {formData.lastName}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Name Extension:</span> {formData.nameExtension || 'N/A'}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Birthdate:</span> {formData.birthdate}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Gender:</span> {formData.gender}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Blood Type:</span> {formData.bloodType}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Civil Status:</span> {formData.civilStatus}
                        </p>
                      </div>
                      {formData.civilStatus === 'Married' && (
                        <>
                          <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">Maiden Name:</span> {formData.maidenName || 'N/A'}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">Name of Spouse:</span> {formData.spouseName || 'N/A'}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">Occupation of Spouse:</span> {formData.spouseOccupation || 'N/A'}
                            </p>
                          </div>
                        </>
                      )}
                      <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Religion:</span> {formData.religion}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Height:</span> {formData.height} cm
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Weight:</span> {formData.weight} kg
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Birthplace:</span> {formData.birthplace}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Contact Number:</span> {formData.contactNumber}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md shadow-sm sm:col-span-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Address:</span> {`${formData.addressDetails}, ${formData.barangayName}, ${formData.cityName}, ${formData.provinceName}, ${formData.regionName}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-xl font-semibold text-white mb-4 border-b-2 border-gray-300 pb-2 bg-blue-600 p-2 rounded-md">Education Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="col-span-3">
                      <h4 className="text-lg font-semibold text-gray-800">Elementary</h4>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">School:</span> {formData.education.elementary.school}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Award:</span> {formData.education.elementary.award}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Year Graduated:</span> {formData.education.elementary.yearGraduated}
                      </p>
                    </div>

                    <div className="col-span-3">
                      <h4 className="text-lg font-semibold text-gray-800">Junior High School</h4>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">School:</span> {formData.education.juniorHighSchool.school}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Award:</span> {formData.education.juniorHighSchool.award}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Year Graduated:</span> {formData.education.juniorHighSchool.yearGraduated}
                      </p>
                    </div>

                    <div className="col-span-3">
                      <h4 className="text-lg font-semibold text-gray-800">Senior High School</h4>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">School:</span> {formData.education.seniorHighSchool.school}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Award:</span> {formData.education.seniorHighSchool.award}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Year Graduated:</span> {formData.education.seniorHighSchool.yearGraduated}
                      </p>
                    </div>

                    <div className="col-span-3">
                      <h4 className="text-lg font-semibold text-gray-800">College</h4>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">School:</span> {formData.education.college.school}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Course:</span> {formData.education.college.course}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-xl font-semibold text-white mb-4 border-b-2 border-gray-300 pb-2 bg-blue-600 p-2 rounded-md">Student ID</h3>
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Student ID File:</span> {formData.studentIdFile ? formData.studentIdFile.name : 'N/A'}
                    </p>
                    {formData.studentIdFile && (
                      <div className="w-48 h-48 border border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer" onClick={handleImageClick}>
                        <img
                          src={URL.createObjectURL(formData.studentIdFile)}
                          alt="Student ID"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-xl font-semibold text-white mb-4 border-b-2 border-gray-300 pb-2 bg-blue-600 p-2 rounded-md">Certificate of Registration (COR)</h3>
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">COR File:</span> {formData.certificateOfRegistrationFile ? formData.certificateOfRegistrationFile.name : 'N/A'}
                    </p>
                    {formData.certificateOfRegistrationFile && (
                      <div className="w-48 h-48 border border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer" onClick={handleImageClick}>
                        <img
                          src={URL.createObjectURL(formData.certificateOfRegistrationFile)}
                          alt="Certificate of Registration"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Image Modal */}
                {showImageModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="relative bg-white rounded-lg shadow-lg p-4 max-w-md max-h-md overflow-auto">
                      <button
                        onClick={() => setShowImageModal(false)}
                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                      >
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <img
                        src={URL.createObjectURL(formData.studentIdFile)}
                        alt="Student ID"
                        className="object-contain max-w-full max-h-full"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleConfirmSubmit}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-200 focus:outline-none ${isLoading ? 'cursor-not-allowed' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                    ) : (
                      'Confirm Submit'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* End Modal */}


    </div >
  );
}
