import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { regions, provinces, cities, barangays } from 'select-philippines-address';

const Step1 = ({ formData, setFormData, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Boolean to check if the selected civil status is 'Married'
  const isMarried = formData.civilStatus === 'Married';

  useEffect(() => {
    if (!isMarried) {
      setFormData(prevState => ({
        ...prevState,
        maidenName: '',
        spouseName: '',
        spouseOccupation: ''
      }));
    }
  }, [formData.civilStatus]);

  const [regionList, setRegionList] = useState([]);
  const [provinceList, setProvinceList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [barangayList, setBarangayList] = useState([]);

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedBarangay, setSelectedBarangay] = useState('');

  // Fetch all regions on component mount
  useEffect(() => {
    regions().then(setRegionList);
  }, []);

  // Fetch provinces when a region is selected
  useEffect(() => {
    if (selectedRegion) {
      provinces(selectedRegion).then(setProvinceList);
      setFormData(prevState => ({
        ...prevState,
        region: selectedRegion,
        province: '',
        city: '',
        barangay: ''
      }));
    }
  }, [selectedRegion]);

  // Fetch cities when a province is selected
  useEffect(() => {
    if (selectedProvince) {
      cities(selectedProvince).then(setCityList);
      setFormData(prevState => ({
        ...prevState,
        province: selectedProvince,
        city: '',
        barangay: ''
      }));
    }
  }, [selectedProvince]);

  // Fetch barangays when a city is selected
  useEffect(() => {
    if (selectedCity) {
      barangays(selectedCity).then(setBarangayList);
      setFormData(prevState => ({
        ...prevState,
        city: selectedCity,
        barangay: ''
      }));
    }
  }, [selectedCity]);

  // Update formData when barangay is selected
  useEffect(() => {
    if (selectedBarangay) {
      setFormData(prevState => ({
        ...prevState,
        barangay: selectedBarangay
      }));
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

  // Set dummy data for location
  // useEffect(() => {
  //   const dummyData = {
  //     region: '03',
  //     province: '0349',
  //     city: '034904',
  //     barangay: '034904004',
  //   };

  //   setSelectedRegion(dummyData.region);
  //   setSelectedProvince(dummyData.province);
  //   setSelectedCity(dummyData.city);
  //   setSelectedBarangay(dummyData.barangay);
  // }, []);

  return (
    <div>
      <div className="max-w-8xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
          <span className='text-lg font-bold'>Personal Information</span>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Middle Name</label>
            <input
              type="text"
              name="middleName"
              placeholder="Enter your middle name"
              value={formData.middleName}
              onChange={handleChange}
              required
              className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
            />
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
              required
              className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Birthplace</label>
            <input
              type="text"
              name="birthplace"
              value={formData.birthplace}
              onChange={handleChange}
              required
              className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
              placeholder="Enter birthplace"
            />
          </div>


          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
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
              required
              className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
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
              className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
              value={formData.civilStatus}
              onChange={handleChange}
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
              disabled={!isMarried}
              placeholder="Enter maiden name"
              className={`standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full ${!isMarried ? 'text-gray-400' : ''}`}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Name of Spouse</label>
            <input
              type="text"
              name="spouseName"
              value={formData.spouseName}
              onChange={handleChange}
              disabled={!isMarried}
              placeholder="Enter name of spouse"
              className={`standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full ${!isMarried ? 'text-gray-400' : ''}`}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Occupation of Spouse</label>
            <input
              type="text"
              name="spouseOccupation"
              value={formData.spouseOccupation}
              onChange={handleChange}
              disabled={!isMarried}
              placeholder="Enter occupation of spouse"
              className={`standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full ${!isMarried ? 'text-gray-400' : ''}`}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Religion</label>
            <select
              name="religion"
              value={formData.religion}
              onChange={handleChange}
              required
              className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
            >
              <option value="Roman Catholic">Roman Catholic</option>
              <option value="Iglesia ni Cristo">Iglesia ni Cristo</option>
              <option value="Islam">Islam</option>
              <option value="Born Again Christian">Born Again Christian</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className='flex flex-col'>
            <label className='block text-sm font-medium text-slate-700 mb-2'>Height and Weight</label>
            <div className='flex gap-2'>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                required
                className='text-sm standard-input border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                placeholder="Height in cm"
              />

              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                required
                className='text-sm standard-input border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                placeholder="Weight in kg"
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
            <input
              type="eml"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
              placeholder="Enter email"
            />
          </div>


          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
              className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
              placeholder="Enter contact number"
            />
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4 px-4 mt-4'>
          {/* Region Selector */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Region:</label>
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setProvinceList([]); // Reset on region change
                setCityList([]);
                setBarangayList([]);
              }}
              className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
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
            <label className='block text-sm font-medium text-gray-700 mb-2'>Province:</label>
            <select
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                setCityList([]);
                setBarangayList([]);
              }}
              className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
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
            <label className='block text-sm font-medium text-gray-700 mb-2'>City/Municipality:</label>
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setBarangayList([]);
              }}
              className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
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
            <label className='block text-sm font-medium text-gray-700 mb-2'>Barangay:</label>
            <select
              value={selectedBarangay}
              onChange={(e) => setSelectedBarangay(e.target.value)}
              className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
            >
              <option value="">Select Barangay</option>
              {barangayList.map((barangay) => (
                <option key={barangay.brgy_code} value={barangay.brgy_code}>
                  {barangay.brgy_name}
                </option>
              ))}
            </select>
          </div>

          {/*  */}
          <div className='w-full flex flex-col lg:col-span-1 mb-4'>
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
      </div>
    </div>
  );
};

export default Step1;