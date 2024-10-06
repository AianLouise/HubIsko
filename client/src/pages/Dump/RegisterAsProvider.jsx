import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRightLong } from "react-icons/fa6";
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase";
import { FaBuilding, FaUser, FaFileAlt, FaCheckCircle } from 'react-icons/fa';
import { regions, provinces, cities, barangays, regionByCode, provincesByCode, provinceByName } from "select-philippines-address";
import { Link } from 'react-router-dom';

export default function RegisterAsProvider() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    profilePicture: '',
    organizationName: '',
    organizationType: '',
    registrationNumber: '',
    contactPersonName: '',
    contactPersonPosition: '',
    contactPersonNumber: '',
    addressDetails: '',
    region: '',
    province: '',
    city: '',
    barangay: '',
    website: '',
    confirmPassword: '',
    agreeTerms: false,
    registrationCertificate: '',
    tin: '',
    proofOfAddress: '',
    authorizationLetter: '',
    idProofContactPerson: '',
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [uploadProgress, setUploadProgress] = useState({});

  // useEffect(() => {
  //   let intervalId;
  //   if (showModal && countdown > 0) {
  //     intervalId = setInterval(() => {
  //       setCountdown(prevCountdown => prevCountdown - 1);
  //     }, 1000);
  //   } else if (countdown === 0) {
  //     window.location.href = '/';
  //   }
  //   return () => clearInterval(intervalId);
  // }, [showModal, countdown]);

  useEffect(() => {
    if (showModal) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 1) {
            clearInterval(timer);
            handleLogin();
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }
  }, [showModal]);

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;

    const currentDate = new Date().toISOString().split('T')[0];
    const fileExtension = file.name.split('.').pop();
    const formattedFileName = `provider-documents/${formData.organizationName}/${formData.organizationName}_${name}_${currentDate}.${fileExtension}`;
    const storageRef = ref(storage, formattedFileName);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress((prevProgress) => ({
          ...prevProgress,
          [name]: progress,
        }));
      },
      (error) => {
        console.error("File upload error:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prevState) => ({
            ...prevState,
            [name]: downloadURL,
          }));
        });
      }
    );
  };

  const [activeStep, setActiveStep] = useState(1);
  const maxStep = 4;

  const validateStep = () => {
    const newErrors = {};

    if (activeStep === 1) {
      if (!formData.profilePicture) newErrors.profilePicture = 'Organization image is required';
      if (!formData.organizationName) newErrors.organizationName = 'Organization name is required';
      if (!formData.organizationType) newErrors.organizationType = 'Organization type is required';
      if (!formData.registrationNumber) newErrors.registrationNumber = 'Registration number is required';
      if (!formData.contactPersonName) newErrors.contactPersonName = 'Contact person name is required';
      if (!formData.contactPersonPosition) newErrors.contactPersonPosition = 'Contact person position is required';
      if (!formData.contactPersonNumber) newErrors.contactPersonNumber = 'Contact person number is required';
      if (!formData.regionCode) newErrors.regionCode = 'Region is required';
      if (!formData.provinceCode) newErrors.provinceCode = 'Province is required';
      if (!formData.cityCode) newErrors.cityCode = 'City is required';
      if (!formData.barangay) newErrors.barangay = 'Barangay is required';
      if (!formData.addressDetails) newErrors.addressDetails = 'Address details are required';
      if (!formData.website) newErrors.website = 'Website is required';
    } else if (activeStep === 2) {
      // Add validation for step 2
      if (!formData.username) newErrors.username = 'Account username is required';
      if (!formData.email) newErrors.email = 'Account email is required';
      if (!formData.password) newErrors.password = 'Account password is required';
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    } else if (activeStep === 3) {
      // Add validation for step 3
      if (!formData.registrationCertificate) newErrors.registrationCertificate = 'Registration Certificate is required';
      if (!formData.tin) newErrors.tin = 'TIN is required';
      if (!formData.proofOfAddress) newErrors.proofOfAddress = 'Proof of Address is required';
      if (!formData.authorizationLetter) newErrors.authorizationLetter = 'Authorization Letter is required';
      if (!formData.idProofContactPerson) newErrors.idProofContactPerson = 'ID Proof of Contact Person is required';
    } else if (activeStep === 4) {
      // Add validation for step 4
      if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep(prevStep => (prevStep < maxStep ? prevStep + 1 : prevStep));
    }
  };

  const handlePrevious = () => {
    setActiveStep(prevStep => Math.max(1, prevStep - 1));
  };

  // const validateForm = () => {
  //   let errors = {};
  //   if (!formData.organizationName) errors.organizationName = 'Organization Name is required.';
  //   if (!formData.organizationType) errors.organizationType = 'Organization Type is required.';
  //   if (!formData.registrationNumber) errors.registrationNumber = 'Registration Number is required.';
  //   if (!formData.email) errors.email = 'Email is required.';
  //   if (!formData.username) errors.username = 'Username is required.';
  //   if (!formData.password) errors.password = 'Password is required.';
  //   if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match.';
  //   if (!formData.agreeTerms) errors.agreeTerms = 'You must agree to the terms and conditions.';
  //   if (activeStep === 3) {
  //     // Check for required files in step 3
  //     if (!formData.registrationCertificate) errors.registrationCertificate = 'Registration Certificate is required.';
  //     if (!formData.tin) errors.tin = 'TIN is required.';
  //     if (!formData.proofOfAddress) errors.proofOfAddress = 'Proof of Address is required.';
  //     if (!formData.authorizationLetter) errors.authorizationLetter = 'Authorization Letter is required.';
  //     if (!formData.idProofContactPerson) errors.idProofContactPerson = 'ID Proof of Contact Person is required.';
  //   }
  //   return errors;
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Perform form validation
    const newErrors = {};

    // Add validation for step 4
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the Terms and Conditions';

    // Other validation logic...

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return; // Stop submission if there are validation errors
    }

    try {
      // Upload profile picture to Firebase Storage
      const profilePictureRef = ref(storage, `profilePictures/${formData.profilePicture.name}`);
      const snapshot = await uploadBytes(profilePictureRef, formData.profilePicture);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update formData with the download URL
      const updatedFormData = {
        ...formData,
        profilePicture: downloadURL,
      };

      // Log all form data to the console
      console.log('Form Data:', updatedFormData);

      // Send form data to the API endpoint
      const response = await fetch('/api/provider/signupAsProvider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Success:', result);

      setLoading(false);
      setShowModal(true);
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
      // Handle error (e.g., show error message to the user)
    }
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      profilePicture: e.target.files[0],
    });
  };

  const [regionList, setRegionList] = useState([]);
  const [provinceList, setProvinceList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [barangayList, setBarangayList] = useState([]);

  useEffect(() => {
    regions().then(setRegionList);
  }, []);

  const handleRegionChange = (e) => {
    const regionCode = e.target.value;
    const selectedRegion = regionList.find(region => region.region_code === regionCode);
    const regionName = selectedRegion ? selectedRegion.region_name : '';

    setFormData({ ...formData, region: regionName, regionCode: regionCode, province: '', city: '', barangay: '' });
    provinces(regionCode).then(setProvinceList);
    setCityList([]);
    setBarangayList([]);
  };

  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    const selectedProvince = provinceList.find(province => province.province_code === provinceCode);
    const provinceName = selectedProvince ? selectedProvince.province_name : '';

    setFormData({ ...formData, province: provinceName, provinceCode: provinceCode, city: '', barangay: '' });
    cities(provinceCode).then(setCityList);
    setBarangayList([]);
  };

  const handleCityChange = (e) => {
    const cityCode = e.target.value;
    const selectedCity = cityList.find(city => city.city_code === cityCode);
    const cityName = selectedCity ? selectedCity.city_name : '';

    setFormData({ ...formData, city: cityName, cityCode: cityCode });
    barangays(cityCode).then(setBarangayList);
  };

  const handleBarangayChange = (e) => {
    const barangayCode = e.target.value;
    setFormData({ ...formData, barangay: barangayCode });
  };

  return (
    <main className='bg-[#f8f8fb] font-medium flex flex-col items-center min-h-screen pb-14 pt-14'>
      <span className='text-2xl text-slate-500'>Let's get your organization setup!</span>
      <span className='text-sm mt-2 text-slate-500 lg:mb-0 mb-4'>We'll guide you step by step!</span>
      <div className='hidden lg:flex justify-center items-center gap-4 mt-4 mb-8'>
        {[1, 2, 3, 4].map((step) => (
          <React.Fragment key={step}>
            <div className='flex flex-col gap-1 items-center text-center'>
              <span className={`text-xl font-bold ${activeStep === step ? 'text-blue-600' : 'text-gray-400'}`}>{step}</span>
              <button
                className={`w-12 h-12 shadow rounded-md flex items-center justify-center ${activeStep === step ? 'bg-blue-600' : 'border'}`}
                onClick={() => activeStep === step && setActiveStep(step)}
                disabled={activeStep !== step}
              >
                {step === 1 && <FaBuilding className={activeStep === step ? 'text-white' : 'text-blue-600'} />}
                {step === 2 && <FaUser className={activeStep === step ? 'text-white' : 'text-blue-600'} />}
                {step === 3 && <FaFileAlt className={activeStep === step ? 'text-white' : 'text-blue-600'} />}
                {step === 4 && <FaCheckCircle className={activeStep === step ? 'text-white' : 'text-blue-600'} />}
              </button>
              <span className='text-sm text-slate-600'>
                {step === 1 && "Organization Information"}
                {step === 2 && "Account Information"}
                {step === 3 && "Documents Information"}
                {step === 4 && "Terms and Conditions"}
              </span>
            </div>
            {step < 4 && <FaArrowRightLong className='text-4xl text-blue-600' />}
          </React.Fragment>
        ))}
      </div>

      <div className='lg:hidden w-full flex flex-col mb-4 px-2'>
        <div className='flex justify-between items-center px-6 py-2 text-sm text-slate-500'>
          <span>Requirement</span>
          <span>Stages</span>
        </div>

        {[0, 1, 2, 3, 4].map((step) => (
          <React.Fragment key={step}>
            <div className={`border-2 border-blue-600 rounded-md shadow w-full py-2 px-4 flex justify-between items-center ${activeStep === step ? 'flex' : 'hidden'} `}>
              <div className={`gap-2 items-center text-blue-600 ${step === 1 ? 'flex' : 'hidden'}`}>
                <FaBuilding className='text-2xl' />
                <span className='font-bold'>Organization Information</span>
              </div>

              <div className={`gap-2 items-center text-blue-600 ${step === 2 ? 'flex' : 'hidden'}`}>
                <FaUser className='text-2xl' />
                <span className='font-bold'>Account Information</span>
              </div>

              <div className={`gap-2 items-center text-blue-600 ${step === 3 ? 'flex' : 'hidden'}`}>
                <FaFileAlt className='text-2xl' />
                <span className='font-bold'>Documents Information</span>
              </div>

              <div className={`gap-2 items-center text-blue-600 ${step === 4 ? 'flex' : 'hidden'}`}>
                <FaCheckCircle className='text-2xl' />
                <span className='font-bold'>Terms and Conditions</span>
              </div>


              <div>
                <span className='text-blue-600 text-4xl font-bold'> {activeStep}<span className='text-slate-400'>/4</span></span>
              </div>
            </div>
          </React.Fragment>
        ))}

      </div>


      <div className='w-full lg:max-w-4xl lg:mx-auto lg:px-8'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {activeStep === 1 && (
            <div className='bg-white p-8 shadow rounded-md border'>
              <h2 className="lg:text-2xl text-xl text-center lg:text-left font-bold mb-6">Enter Organization Information</h2>
              <div className='grid lg:grid-cols-2 gap-4'>
                <div className="mb-4 lg:col-span-2">
                  <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 text-center mb-2">
                    Organization Image
                  </label>
                  <div className="flex flex-col items-center">
                    <input
                      type="file"
                      name="profilePicture"
                      id="profilePicture"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    {formData.profilePicture ? (
                      <div className="flex justify-center mt-4">
                        <img
                          src={URL.createObjectURL(formData.profilePicture)}
                          alt="Organization"
                          className="w-32 h-32 object-cover rounded-full border-2 border-gray-300 cursor-pointer"
                          onClick={() => document.getElementById('profilePicture').click()}
                        />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => document.getElementById('profilePicture').click()}
                        className="mt-1 p-2 w-48 border rounded-md bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
                      >
                        Upload Organization Image
                      </button>
                    )}
                    {errors.profilePicture && <p className="text-red-500 text-sm mt-2">{errors.profilePicture}</p>}
                  </div>

                </div>

                <div className="mb-4">
                  <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">Organization Name</label>
                  <input type="text" name="organizationName" id="organizationName" value={formData.organizationName} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Full legal name of the organization" />
                  {errors.organizationName && <p className="text-red-500 text-sm">{errors.organizationName}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="organizationType" className="block text-sm font-medium text-gray-700">Organization Type</label>
                  <select
                    name="organizationType"
                    id="organizationType"
                    value={formData.organizationType}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border rounded-md"
                  >
                    <option value="" disabled>Select organization type</option>
                    <option value="Non-profit">Non-profit</option>
                    <option value="Educational Institution">Educational Institution</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Government">Government</option>
                  </select>
                  {errors.organizationType && <p className="text-red-500 text-sm">{errors.organizationType}</p>}
                </div>

                <div className="mb-4">
                  <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">Registration Number</label>
                  <input type="text" name="registrationNumber" id="registrationNumber" value={formData.registrationNumber} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Official registration or incorporation number" />
                  {errors.registrationNumber && <p className="text-red-500 text-sm">{errors.registrationNumber}</p>}
                </div>
                <hr className="col-span-2" />
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Contact Person Details</label>
                  <div className="grid lg:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label htmlFor="contactPersonName" className="block text-sm font-medium text-gray-700">Name</label>
                      <input type="text" name="contactPersonName" id="contactPersonName" value={formData.contactPersonName} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Full name of the individual responsible for the registration" />
                      {errors.contactPersonName && <p className="text-red-500 text-sm">{errors.contactPersonName}</p>}
                    </div>
                    <div className="mb-4">
                      <label htmlFor="contactPersonPosition" className="block text-sm font-medium text-gray-700">Position</label>
                      <input type="text" name="contactPersonPosition" id="contactPersonPosition" value={formData.contactPersonPosition} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Job title or position within the organization" />
                      {errors.contactPersonPosition && <p className="text-red-500 text-sm">{errors.contactPersonPosition}</p>}
                    </div>
                    <div className="mb-4">
                      <label htmlFor="contactPersonNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
                      <input type="text" name="contactPersonNumber" id="contactPersonNumber" value={formData.contactPersonNumber} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Direct contact number for the contact person" />
                      {errors.contactPersonNumber && <p className="text-red-500 text-sm">{errors.contactPersonNumber}</p>}
                    </div>
                  </div>
                </div>
                <hr className="col-span-2" />
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Physical Address</label>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='col-span-1'>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Region
                      </label>
                      <select
                        name="region"
                        value={formData.regionCode}
                        onChange={handleRegionChange}
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
                      {errors.regionCode && <p className="text-red-500 text-sm">{errors.regionCode}</p>}
                    </div>

                    <div className='col-span-1'>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Province
                      </label>
                      <select
                        name="province"
                        value={formData.provinceCode}
                        onChange={handleProvinceChange}
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
                      {errors.provinceCode && <p className="text-red-500 text-sm">{errors.provinceCode}</p>}
                    </div>

                    <div className='col-span-1'>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        City
                      </label>
                      <select
                        name="city"
                        value={formData.cityCode || ''}
                        onChange={handleCityChange}
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
                      {errors.cityCode && <p className="text-red-500 text-sm">{errors.cityCode}</p>}
                    </div>

                    <div className='col-span-1'>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Barangay
                      </label>
                      <select
                        name="barangay"
                        value={formData.barangay}
                        onChange={handleBarangayChange}
                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                        required
                      >
                        <option value="">Select Barangay</option>
                        {barangayList.map((barangay) => (
                          <option key={barangay.brgy_code} value={barangay.brgy_name}>
                            {barangay.brgy_name}
                          </option>
                        ))}
                      </select>
                      {errors.barangay && <p className="text-red-500 text-sm">{errors.barangay}</p>}
                    </div>

                    <div className='col-span-1'>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        House No./Unit No./Bldg/Floor, Street, Subdivision
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
                      {errors.addressDetails && <p className="text-red-500 text-sm">{errors.addressDetails}</p>}
                    </div>
                  </div>
                </div>
                <hr className="col-span-2" />
                <div className="mb-4 col-span-2">
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
                  <input type="text" name="website" id="website" value={formData.website} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Official website URL of the organization" />
                  {errors.website && <p className="text-red-500 text-sm">{errors.website}</p>}
                </div>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className='bg-white p-8 shadow rounded-md border'>
              <h2 className="text-2xl font-bold mb-6">Enter Account Information</h2>
              <div className='grid grid-cols-2 gap-4'>
                <div className="mb-4 col-span-2">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                  <input type="text" name="username" id="username" value={formData.username} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Enter your username" />
                  {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                </div>
                <div className="mb-4 col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Enter your email address" />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                <div className="mb-4 col-span-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Choose a strong password" />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>
                <div className="mb-4 col-span-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Re-enter your password" />
                  {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className='bg-white p-8 shadow rounded-md border'>
              <h2 className="text-2xl font-bold mb-6">Upload Required Documents</h2>
              <div className='grid grid-cols-2 gap-4'>
                <div className="mb-4">
                  <label htmlFor="registrationCertificate" className="block text-sm font-medium text-gray-700">Registration Certificate</label>
                  <input type="file" name="registrationCertificate" id="registrationCertificate" onChange={handleFileChange} className="mt-1 p-2 w-full border rounded-md" />
                  {errors.registrationCertificate && <p className="text-red-500 text-sm">{errors.registrationCertificate}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="tin" className="block text-sm font-medium text-gray-700">TIN</label>
                  <input type="file" name="tin" id="tin" onChange={handleFileChange} className="mt-1 p-2 w-full border rounded-md" />
                  {errors.tin && <p className="text-red-500 text-sm">{errors.tin}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="proofOfAddress" className="block text-sm font-medium text-gray-700">Proof of Address</label>
                  <input type="file" name="proofOfAddress" id="proofOfAddress" onChange={handleFileChange} className="mt-1 p-2 w-full border rounded-md" />
                  {errors.proofOfAddress && <p className="text-red-500 text-sm">{errors.proofOfAddress}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="authorizationLetter" className="block text-sm font-medium text-gray-700">Authorization Letter</label>
                  <input type="file" name="authorizationLetter" id="authorizationLetter" onChange={handleFileChange} className="mt-1 p-2 w-full border rounded-md" />
                  {errors.authorizationLetter && <p className="text-red-500 text-sm">{errors.authorizationLetter}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="idProofContactPerson" className="block text-sm font-medium text-gray-700">ID Proof of Contact Person</label>
                  <input type="file" name="idProofContactPerson" id="idProofContactPerson" onChange={handleFileChange} className="mt-1 p-2 w-full border rounded-md" />
                  {errors.idProofContactPerson && <p className="text-red-500 text-sm">{errors.idProofContactPerson}</p>}
                </div>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className='bg-white p-8 shadow rounded-md border'>
              <h2 className="text-2xl font-bold mb-6">Agree to Terms and Conditions</h2>
              <div className="mb-4">
                <div className="bg-gray-100 p-4 rounded-md mb-4 max-h-60 overflow-y-scroll" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <p><strong>1. Introduction</strong></p>
                  <p>Welcome to HubIsko. These Terms and Conditions govern your registration and use of our services as a scholarship provider. By registering as a scholarship provider, you agree to comply with and be bound by these Terms. If you do not agree with any part of these Terms, please do not proceed with registration.</p>

                  <p className="mt-4"><strong>2. Eligibility</strong></p>
                  <p>To register as a scholarship provider on HubIsko, you must:</p>
                  <ul>
                    <li>Be a legitimate organization, institution, or individual with the authority to offer scholarships.</li>
                    <li>Provide accurate and complete information during the registration process.</li>
                    <li>Agree to comply with all applicable laws and regulations related to scholarships.</li>
                  </ul>

                  <p className="mt-4"><strong>3. Account Responsibilities</strong></p>
                  <p>Upon successful registration, you will be granted access to an account to manage your scholarships. You are responsible for:</p>
                  <ul>
                    <li>Maintaining the confidentiality of your account credentials.</li>
                    <li>Ensuring that all information provided through your account is accurate, current, and complete.</li>
                    <li>Reporting any unauthorized use of your account to us immediately.</li>
                  </ul>

                  <p className="mt-4"><strong>4. Scholarship Program Creation</strong></p>
                  <p>When creating a scholarship program, you agree to:</p>
                  <ul>
                    <li>Provide accurate and complete information about the scholarship program, including but not limited to title, description, eligibility criteria, and deadlines.</li>
                    <li>Ensure that your scholarship programs comply with all relevant laws and regulations.</li>
                    <li>Obtain and provide all necessary documentation and approvals for the scholarship program.</li>
                  </ul>

                  <p className="mt-4"><strong>5. Content and Conduct</strong></p>
                  <p>You agree that:</p>
                  <ul>
                    <li>All content you provide, including scholarship descriptions and requirements, must be truthful and not misleading.</li>
                    <li>You will not use the Platform to engage in any unlawful, fraudulent, or harmful activities.</li>
                    <li>You will respect the privacy and rights of applicants and other users of the Platform.</li>
                  </ul>

                  <p className="mt-4"><strong>6. Platform Use</strong></p>
                  <p>We reserve the right to:</p>
                  <ul>
                    <li>Modify or discontinue any aspect of the Platform, including but not limited to features, functionality, and availability.</li>
                    <li>Remove or reject any content or scholarship program that violates these Terms or our content policies.</li>
                  </ul>

                  <p className="mt-4"><strong>7. Fees and Payments</strong></p>
                  <p>If applicable, you agree to:</p>
                  <ul>
                    <li>Pay any fees associated with using the Platform as a scholarship provider.</li>
                    <li>Comply with our payment terms and conditions, which will be provided separately.</li>
                  </ul>

                  <p className="mt-4"><strong>8. Termination</strong></p>
                  <p>We may terminate your account and access to the Platform if you:</p>
                  <ul>
                    <li>Violate these Terms or any other policies of the Platform.</li>
                    <li>Fail to comply with applicable laws and regulations.</li>
                    <li>Engage in behavior that we deem inappropriate or harmful to the Platform or its users.</li>
                  </ul>

                  <p className="mt-4"><strong>9. Limitation of Liability</strong></p>
                  <p>To the maximum extent permitted by law, HubIsko shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform or any scholarship programs you create.</p>

                  <p className="mt-4"><strong>10. Indemnification</strong></p>
                  <p>You agree to indemnify and hold harmless HubIsko, its affiliates, officers, directors, employees, and agents from any claims, damages, liabilities, costs, and expenses arising out of your use of the Platform or violation of these Terms.</p>

                  <p className="mt-4"><strong>11. Changes to Terms</strong></p>
                  <p>We may update these Terms from time to time. We will notify you of any significant changes by posting the revised Terms on the Platform. Your continued use of the Platform after such changes indicates your acceptance of the updated Terms.</p>

                  <p className="mt-4"><strong>12. Governing Law</strong></p>
                  <p>These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law principles. Any disputes arising from these Terms shall be resolved in the courts of [Your Jurisdiction].</p>

                  <p className="mt-4"><strong>13. Contact Us</strong></p>
                  <p>If you have any questions or concerns about these Terms or your registration as a scholarship provider, please contact us at:</p>
                  <p>HubIsko</p>
                  <p>[Your Contact Information]</p>
                  <p>Email: contact@hubisko.com</p>
                  <p>Phone: [Your Phone Number]</p>
                  <p>Address: [Your Address]</p>
                </div>
                <label className="inline-flex items-center">
                  <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out" />
                  <span className="ml-2 text-sm text-gray-700">I agree to the <a href="#" className="text-blue-500">Terms and Conditions</a></span>
                </label>
                {errors.agreeTerms && <p className="text-red-500 text-sm">{errors.agreeTerms}</p>}
              </div>
            </div>
          )}


          <div className='flex justify-between mt-8'>
            {activeStep === 1 && <Link to={'/login'} className="bg-white border-2 hover:bg-slate-200 text-gray px-6 py-2 rounded-md">Go back to Login</Link>}
            {activeStep > 1 && <button type="button" onClick={handlePrevious} className="bg-gray-300 text-gray px-6 py-2 rounded-md">Previous</button>}
            {activeStep < maxStep && activeStep !== 1 && <button type="button" onClick={handleNext} className="bg-blue-600 text-white px-6 py-2 rounded-md">Next</button>}
            {activeStep === 1 && <div className="flex-grow"></div>}
            {activeStep === 1 && <button type="button" onClick={handleNext} className="bg-blue-600 hover:bg-blue-800 text-white px-6 py-2 rounded-md">Next</button>}
            {activeStep === maxStep && (
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md flex items-center justify-center">
                {loading ? (
                  <div className="flex justify-center items-center">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                  </div>
                ) : (
                  'Submit'
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-md shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Sending Email Verification</h2>
            <p>Please wait while we send the verification link to your email address.</p>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-md shadow-lg text-center">
            <FaCheckCircle className="text-green-500 text-4xl mb-4" />
            <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
            <p className="mb-4">Your registration was successful.</p>
            <p className="mb-4">A verification link has been sent to your email address. Please check your inbox and verify your email.</p>
            <p>You will be redirected to the login page in {countdown} seconds.</p>
            <button onClick={handleLogin} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md">Go to Login</button>
          </div>
        </div>
      )}
    </main>
  );
}
