import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserSuccess } from '../redux/user/userSlice'; // Adjust the import path as needed
import { useNavigate } from 'react-router-dom';
import { regions, provinces, cities, barangays, regionByCode, provincesByCode, provinceByName } from "select-philippines-address";
import { storage } from '../firebase'; // Import Firebase storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import necessary Firebase functions

// regions().then((region) => console.log(region));
// regionByCode("01").then((region) => console.log(region.region_name));
// provinces("01").then((province) => console.log(province));
// provincesByCode("01").then((province) => console.log(province));
// provinceByName("Rizal").then((province) => console.log(province.province_code));
// cities("0128").then((city) => console.log(city));
// barangays("052011").then((barangays) => console.log(barangays));

export default function CompleteProfile() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

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
    regionCode: '',
    province: '',
    provinceCode: '',
    city: '',
    cityCode: '',
    barangay: '',
  });

  const [showModal, setShowModal] = useState(false);
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

    setFormData({ ...formData, city: cityName, cityCode: cityCode, barangay: '' });
    barangays(cityCode).then(setBarangayList);
  };

  const handleBarangayChange = (e) => {
    const barangayCode = e.target.value;
    const selectedBarangay = barangayList.find(barangay => barangay.brgy_code === barangayCode);

    setFormData({ ...formData, barangay: barangayCode });
    // Log the selected barangay code to the console
    console.log('Selected Barangay Code:', barangayCode);
  };

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
    setShowModal(true); // Show modal when form is submitted
    document.body.classList.add('modal-open'); // Add class to body to prevent scrolling
  };

  const handleConfirmSubmit = async () => {
    let profilePictureUrl = '';

    if (formData.profilePicture) {
      const storageRef = ref(storage, `profilePictures/${formData.profilePicture.name}`);
      await uploadBytes(storageRef, formData.profilePicture);
      profilePictureUrl = await getDownloadURL(storageRef);
    }

    const updatedFormData = {
      ...formData,
      profilePicture: profilePictureUrl,
    };
    console.log('Updated form data:', updatedFormData);

    fetch('/api/user/complete-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedFormData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then((data) => {
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
        }));
        navigate('/complete-profile-confirmation');
      })
      .catch((error) => console.error('Error:', error));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      profilePicture: file,
    });
  };

  return (
    <div>
      <div className=" flex justify-center pt-8 rounded-md">
        <h2 className="text-base lg:text-xl font-medium text-slate-600">Please fill out the areas to complete your profile</h2>
      </div>
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-6 text-sm lg:text-base bg-white px-4 lg:px-0 lg:border rounded-lg shadow-lg mt-4 mb-10">
        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
          <span className='text-lg font-bold'>Basic Information</span>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4'>
          <div className='col-span-1 md:col-span-2 lg:col-span-4 text-center'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Profile Picture</label>
            <div className='flex justify-center'>
              <div className='relative'>
                <input
                  type="file"
                  name="profilePicture"
                  accept="image/*"
                  onChange={handleFileChange}
                  className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                />
                <div className='w-24 h-24 rounded-full border border-gray-300 flex items-center justify-center overflow-hidden'>
                  <img
                    src={
                      formData.profilePicture
                        ? URL.createObjectURL(formData.profilePicture)
                        : currentUser.profilePicture
                          ? currentUser.profilePicture
                          : 'default-profile-picture-url'
                    }
                    alt="Profile"
                    className='w-full h-full object-cover'
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Middle Name</label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
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

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Birthdate</label>
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Gender</label>
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
            <label className='block text-sm font-medium text-gray-700 mb-2'>Blood Type</label>
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
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Civil Status</label>
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

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Maiden Name</label>
            <input
              type="text"
              name="maidenName"
              value={formData.maidenName}
              onChange={handleChange}
              placeholder="Enter maiden name"
              disabled={isSingleWidowedOrDivorced}
              className={`standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full ${isSingleWidowedOrDivorced ? 'text-gray-400' : ''}`}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Name of Spouse</label>
            <input
              type="text"
              name="spouseName"
              value={formData.spouseName}
              onChange={handleChange}
              placeholder="Enter name of spouse"
              disabled={isSingleWidowedOrDivorced}
              className={`standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full ${isSingleWidowedOrDivorced ? 'text-gray-400' : ''}`}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Occupation of Spouse</label>
            <input
              type="text"
              name="spouseOccupation"
              value={formData.spouseOccupation}
              onChange={handleChange}
              placeholder="Enter occupation of spouse"
              disabled={isSingleWidowedOrDivorced}
              className={`standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full ${isSingleWidowedOrDivorced ? 'text-gray-400' : ''}`}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Religion</label>
            <select
              name="religion"
              value={formData.religion}
              onChange={handleChange}
              className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
              required
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
              name="height"
              value={formData.height}
              onChange={handleChange}
              className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
              placeholder="Enter height in cm"
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Weight</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
              placeholder="Enter weight in kg"
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Birthplace</label>
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
            <label className='block text-sm font-medium text-gray-700 mb-2'>Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
              placeholder="Enter contact number"
              pattern="^(09|\+639)\d{9}$"
              title="Please enter a valid Philippine phone number (e.g., 09123456789 or +639123456789)"
              required
            />
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4 px-4'>
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
          </div>

          <div className='col-span-1'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Barangay
            </label>
            <select
              name="barangay"
              value={formData.barangay || ''}
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
          </div>

          <div className='w-full flex flex-col lg:col-span-1'>
            <label className='hidden lg:block text-sm font-medium text-gray-700 mb-2'>
              House No./Unit No./Bldg/Floor, Street, Subdivision
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
            type="submit"
            className="py-2 px-6 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
          >
            Submit
          </button>
          <button
            type="reset"
            className="py-2 px-6 bg-gray-500 text-white rounded-lg shadow-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Clear
          </button>
        </div>
      </form>


      {/* Modal */}
      {
        showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-gray-900 bg-opacity-50">
            <div className="relative w-full max-w-lg mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-6">
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
                <div className="space-y-4">
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">First Name:</span> {formData.firstName}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Middle Name:</span> {formData.middleName}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Last Name:</span> {formData.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Birthdate:</span> {formData.birthdate}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Gender:</span> {formData.gender}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Blood Type:</span> {formData.bloodType}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Civil Status:</span> {formData.civilStatus}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Maiden Name:</span> {formData.maidenName || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Name of Spouse:</span> {formData.spouseName || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Occupation of Spouse:</span> {formData.spouseOccupation || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Religion:</span> {formData.religion}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Height:</span> {formData.height} cm
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Weight:</span> {formData.weight} kg
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Birthplace:</span> {formData.birthplace}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Contact Number:</span> {formData.contactNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Address:</span> {`${formData.addressDetails}, ${formData.barangay}, ${formData.city}, ${formData.province}, ${formData.region}`}
                    </p>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => {
                        handleConfirmSubmit();
                        setShowModal(false);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-200 focus:outline-none"
                    >
                      Confirm Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
      {/* End Modal */}


    </div >
  );
}
