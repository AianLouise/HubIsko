import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRightLong } from "react-icons/fa6";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { FaBuilding, FaUser, FaFileAlt, FaCheckCircle } from 'react-icons/fa';

export default function RegisterAsProvider() {
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: '',
    registrationNumber: '',
    email: '',
    contactPersonName: '',
    contactPersonPosition: '',
    contactPersonNumber: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    website: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    registrationCertificate: '',
    tin: '',
    proofOfAddress: '',
    authorizationLetter: '',
    idProofContactPerson: '',
    additionalDocuments: ''
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [uploadProgress, setUploadProgress] = useState({});

  useEffect(() => {
    let intervalId;
    if (showModal && countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      window.location.href = '/';
    }
    return () => clearInterval(intervalId);
  }, [showModal, countdown]);

  const navigate = useNavigate();
  const handleHome = () => {
    navigate('/');
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
    const formattedFileName = `provider-documents/${formData.organizationName}_${name}_${currentDate}`;
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

  const handleNext = () => {
    setActiveStep(prevStep => (prevStep < maxStep ? prevStep + 1 : prevStep));
  };

  const handlePrevious = () => {
    setActiveStep(prevStep => Math.max(1, prevStep - 1));
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.organizationName) errors.organizationName = 'Organization Name is required.';
    if (!formData.organizationType) errors.organizationType = 'Organization Type is required.';
    if (!formData.registrationNumber) errors.registrationNumber = 'Registration Number is required.';
    if (!formData.email) errors.email = 'Email is required.';
    if (!formData.username) errors.username = 'Username is required.';
    if (!formData.password) errors.password = 'Password is required.';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match.';
    if (!formData.agreeTerms) errors.agreeTerms = 'You must agree to the terms and conditions.';
    if (activeStep === 3) {
      // Check for required files in step 3
      if (!formData.registrationCertificate) errors.registrationCertificate = 'Registration Certificate is required.';
      if (!formData.tin) errors.tin = 'TIN is required.';
      if (!formData.proofOfAddress) errors.proofOfAddress = 'Proof of Address is required.';
      if (!formData.authorizationLetter) errors.authorizationLetter = 'Authorization Letter is required.';
      if (!formData.idProofContactPerson) errors.idProofContactPerson = 'ID Proof of Contact Person is required.';
    }
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Perform form validation
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Stop submission if there are validation errors
    }

    // Log all form data to the console
    console.log('Form Data:', formData);

    try {
      // Send form data to the API endpoint
      const response = await fetch('/api/provider/signupAsProvider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Success:', result);

      // Simulate form submission success
      setShowModal(true);
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show error message to the user)
    }
  };

  return (
    <main className='bg-[#f8f8fb] font-medium flex flex-col items-center min-h-screen pb-14 pt-14'>
      <span className='text-2xl text-slate-500'>Let's get your organization setup!</span>
      <span className='text-sm mt-2 text-slate-500'>We'll guide you step by step!</span>
      <div className='flex justify-center items-center gap-4 mt-4 mb-8'>
        {[1, 2, 3, 4].map((step) => (
          <React.Fragment key={step}>
            <div className='flex flex-col gap-1 items-center text-center'>
              <span className={`text-xl font-bold ${activeStep === step ? 'text-blue-600' : 'text-gray-400'}`}>{step}</span>
              <button
                className={`w-12 h-12 shadow rounded-md flex items-center justify-center ${activeStep === step ? 'bg-blue-600' : 'border'}`}
                onClick={() => setActiveStep(step)}
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

      <div className='w-full max-w-4xl mx-auto px-8'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {activeStep === 1 && (
            <div className='bg-white p-8 shadow rounded-md border'>
              <h2 className="text-2xl font-bold mb-6">Enter Organization Information</h2>
              <div className='grid grid-cols-2 gap-4'>
                <div className="mb-4">
                  <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">Organization Name</label>
                  <input type="text" name="organizationName" id="organizationName" value={formData.organizationName} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Full legal name of the organization" />
                  {errors.organizationName && <p className="text-red-500 text-sm">{errors.organizationName}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="organizationType" className="block text-sm font-medium text-gray-700">Organization Type</label>
                  <input type="text" name="organizationType" id="organizationType" value={formData.organizationType} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Type of organization (e.g., Non-profit, Educational Institution, Corporate, Government)" />
                  {errors.organizationType && <p className="text-red-500 text-sm">{errors.organizationType}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">Registration Number</label>
                  <input type="text" name="registrationNumber" id="registrationNumber" value={formData.registrationNumber} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Official registration or incorporation number" />
                  {errors.registrationNumber && <p className="text-red-500 text-sm">{errors.registrationNumber}</p>}
                </div>
                <div className="">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Official email address for communication" />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                <hr className="col-span-2" />
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Contact Person Details</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label htmlFor="contactPersonName" className="block text-sm font-medium text-gray-700">Name</label>
                      <input type="text" name="contactPersonName" id="contactPersonName" value={formData.contactPersonName} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Full name of the individual responsible for the registration" />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="contactPersonPosition" className="block text-sm font-medium text-gray-700">Position</label>
                      <input type="text" name="contactPersonPosition" id="contactPersonPosition" value={formData.contactPersonPosition} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Job title or position within the organization" />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="contactPersonNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
                      <input type="text" name="contactPersonNumber" id="contactPersonNumber" value={formData.contactPersonNumber} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Direct contact number for the contact person" />
                    </div>
                  </div>
                </div>
                <hr className="col-span-2" />
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Physical Address</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700">Street Address</label>
                      <input type="text" name="streetAddress" id="streetAddress" value={formData.streetAddress} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Full street address of the organization" />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                      <input type="text" name="city" id="city" value={formData.city} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="City" />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">State/Province</label>
                      <input type="text" name="state" id="state" value={formData.state} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="State or province" />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                      <input type="text" name="postalCode" id="postalCode" value={formData.postalCode} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Postal or ZIP code" />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                      <input type="text" name="country" id="country" value={formData.country} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Country" />
                    </div>
                  </div>
                </div>
                <hr className="col-span-2" />
                <div className="mb-4 col-span-2">
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
                  <input type="text" name="website" id="website" value={formData.website} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Official website URL of the organization" />
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
                  <input type="text" name="username" id="username" value={formData.username} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Preferred username for account login" />
                  {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
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
                <div className="mb-4">
                  <label htmlFor="additionalDocuments" className="block text-sm font-medium text-gray-700">Additional Documents</label>
                  <input type="file" name="additionalDocuments" id="additionalDocuments" onChange={handleFileChange} className="mt-1 p-2 w-full border rounded-md" />
                </div>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className='bg-white p-8 shadow rounded-md border'>
              <h2 className="text-2xl font-bold mb-6">Agree to Terms and Conditions</h2>
              <div className="mb-4">
                <div className="bg-gray-100 p-4 rounded-md mb-4 max-h-60 overflow-y-scroll" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <h3 className="text-lg font-semibold mb-2">Sample Terms and Conditions</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisl nisi consectetur nisl, euismod consectetur nisi nisl euismod. Nisi vel consectetur euismod, nisl nisi consectetur nisl, euismod consectetur nisi nisl euismod. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisl nisi consectetur nisl, euismod consectetur nisi nisl euismod.
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at consequat nisi. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor.
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat.
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Pellentesque sed dolor. Aliquam congue fermentum nisl. Mauris accumsan nulla vel diam. Sed in lacus ut enim adipiscing aliquet. Nulla venenatis. In pede mi, aliquet sit amet, euismod in, auctor ut, ligula. Aliquam dapibus tincidunt metus.
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    Praesent justo dolor, lobortis quis, lobortis dignissim, pulvinar ac, lorem. Vestibulum sed ante. Donec sagittis euismod purus. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
                  </p>
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
            {activeStep > 1 && <button type="button" onClick={handlePrevious} className="bg-gray-300 text-gray px-6 py-2 rounded-md">Previous</button>}
            {activeStep < maxStep && activeStep !== 1 && <button type="button" onClick={handleNext} className="bg-blue-600 text-white px-6 py-2 rounded-md">Next</button>}
            {activeStep === 1 && <div className="flex-grow"></div>}
            {activeStep === 1 && <button type="button" onClick={handleNext} className="bg-blue-600 text-white px-6 py-2 rounded-md">Next</button>}
            {activeStep === maxStep && <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md">Submit</button>}
          </div>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-md shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
            <p className="mb-4">Your registration was successful.</p>
            <p>You will be redirected to the home page in {countdown} seconds.</p>
            <button onClick={handleHome} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md">Go to Home</button>
          </div>
        </div>
      )}
    </main>
  );
}
