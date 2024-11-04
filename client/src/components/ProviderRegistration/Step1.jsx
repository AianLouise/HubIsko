import React, { useEffect, useState } from 'react';
import { regions, provinces, cities, barangays } from 'select-philippines-address';

const Step1 = ({ formData, setFormData }) => {
    useEffect(() => {
        // Scroll to the top of the page when the component is mounted
        window.scrollTo(0, 0);
    }, []);

    const handleImageChange = (e) => {
        setFormData({
            ...formData,
            profilePicture: e.target.files[0],
        });
    };

    const [charCount, setCharCount] = useState(formData.organizationName.length);
    const charLimit = 100;

    const handleOrganizationNameChange = (e) => {
        const { value } = e.target;
        if (value.length <= charLimit) {
            setFormData(prevState => ({
                ...prevState,
                organizationName: value,
            }));
            setCharCount(value.length);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (value.length <= charLimit) {
            setFormData(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

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
            setSelectedProvince(''); // Clear province
            setSelectedCity(''); // Clear city
            setSelectedBarangay(''); // Clear barangay
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
            setSelectedCity(''); // Clear city
            setSelectedBarangay(''); // Clear barangay
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
            setSelectedBarangay(''); // Clear barangay
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
        <div className='bg-white p-8 shadow rounded-md border max-w-4xl mx-auto'>
            <h2 className="text-2xl font-bold mb-6">Enter Organization Information</h2>
            <div className='grid grid-cols-2 gap-4'>
                <div className="mb-4 col-span-2 font-sans">
                    <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 text-center mb-2">
                        Organization Image <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-col items-center">
                        <input
                            type="file"
                            name="profilePicture"
                            id="profilePicture"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            required
                        />
                        <div className="flex justify-center mt-2">
                            <img
                                src={formData.profilePicture ? URL.createObjectURL(formData.profilePicture) : 'https://via.placeholder.com/150'}
                                alt="Organization"
                                className="w-32 h-32 object-cover rounded-full border-2 border-gray-300 cursor-pointer hover:border-blue-500 transition duration-300"
                                onClick={() => document.getElementById('profilePicture').click()}
                            />
                        </div>
                    </div>
                    <div className="mt-1 text-xs text-gray-600 text-center">
                        Please upload an image representing your organization. Click on the image to change it.
                    </div>
                </div>

                <div className="col-span-2 font-sans">
                    <div className="mb-4">
                        <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">
                            Organization Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="organizationName"
                            id="organizationName"
                            value={formData.organizationName}
                            onChange={handleOrganizationNameChange}
                            className="mt-1 p-2 w-full border rounded-md"
                            placeholder="Full name of the organization"
                            required
                        />
                        <div className="mt-1 text-xs text-gray-600">
                            {charCount}/{charLimit} characters
                        </div>
                        {charCount === charLimit && (
                            <div className="mt-1 text-xs text-red-600">
                                You have reached the character limit.
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="organizationType" className="block text-sm font-medium text-gray-700 mb-2">
                            Organization Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="organizationType"
                            id="organizationType"
                            value={formData.organizationType}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            required
                        >
                            <option value="" disabled>Select organization type</option>
                            <option value="Government Agency">Government Agency (e.g., federal, state, local agencies)</option>
                            <option value="Private Corporation">Private Corporation (e.g., business, companies)</option>
                            <option value="Non-Governmental Organization">Non-Governmental Organization (e.g., charities, non-profit organization/foundations)</option>
                            <option value="Educational Foundation">Educational Foundation (e.g., schools, universities)</option>
                        </select>
                        <div className="mt-1 text-xs text-gray-600">
                            Please select the type of organization you are registering. This helps us categorize your organization correctly.
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
                            Registration Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="registrationNumber"
                            id="registrationNumber"
                            value={formData.registrationNumber}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border rounded-md"
                            placeholder="Official registration or incorporation number"
                            required
                        />
                        <div className="mt-1 text-xs text-gray-600">
                            This is the official number assigned to your organization upon registration or incorporation.
                        </div>
                    </div>
                </div>

                <hr className="col-span-2" />

                <div className="col-span-2 font-sans">
                    <label className="block text-lg font-semibold text-gray-800 mb-2">Contact Person Details</label>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label htmlFor="contactPersonName" className="block text-sm font-medium text-gray-700 mb-1">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="contactPersonName"
                                id="contactPersonName"
                                value={formData.contactPersonName}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                placeholder="Enter the full name of the contact person"
                                required
                            />
                            <div className="mt-1 text-xs text-gray-600">
                                Please enter the full name of the contact person responsible for the registration.
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="contactPersonPosition" className="block text-sm font-medium text-gray-700 mb-1">
                                Position <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="contactPersonPosition"
                                id="contactPersonPosition"
                                value={formData.contactPersonPosition}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                placeholder="Enter the job title or position"
                                required
                            />
                            <div className="mt-1 text-xs text-gray-600">
                                Please enter the job title or position of the contact person within the organization.
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="contactPersonNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                Contact Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="contactPersonNumber"
                                id="contactPersonNumber"
                                value={formData.contactPersonNumber}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d{0,11}$/.test(value)) {
                                        handleChange(e);
                                    }
                                }}
                                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                placeholder="Enter the direct contact number"
                                required
                            />
                            <div className="mt-1 text-xs text-gray-600">
                                Please enter the direct contact number for the contact person. The number should be exactly 11 digits.
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="col-span-2" />

                <div className="col-span-2 font-sans">
                    <label className="block text-lg font-semibold text-gray-800 mb-2">Physical Address</label>

                    <div className='grid lg:grid-cols-2 gap-4 mt-4'>
                        {/* Region Selector */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Region <span className="text-red-500">*</span>
                            </label>
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
                                <option value="" disabled>Select Region</option>
                                {regionList.map((region) => (
                                    <option key={region.region_code} value={region.region_code}>
                                        {region.region_name}
                                    </option>
                                ))}
                            </select>
                            <div className="mt-1 text-xs text-gray-600">
                                Please select the region where your organization is located.
                            </div>
                        </div>

                        {/* Province Selector */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Province <span className="text-red-500">*</span>
                            </label>
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
                                <option value="" disabled>Select Province</option>
                                {provinceList.map((province) => (
                                    <option key={province.province_code} value={province.province_code}>
                                        {province.province_name}
                                    </option>
                                ))}
                            </select>
                            <div className="mt-1 text-xs text-gray-600">
                                Please select the province where your organization is located.
                            </div>
                        </div>

                        {/* City Selector */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                City/Municipality <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={selectedCity}
                                onChange={(e) => {
                                    setSelectedCity(e.target.value);
                                    setBarangayList([]);
                                }}
                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                required
                            >
                                <option value="" disabled>Select City/Municipality</option>
                                {cityList.map((city) => (
                                    <option key={city.city_code} value={city.city_code}>
                                        {city.city_name}
                                    </option>
                                ))}
                            </select>
                            <div className="mt-1 text-xs text-gray-600">
                                Please select the city or municipality where your organization is located.
                            </div>
                        </div>

                        {/* Barangay Selector */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Barangay <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={selectedBarangay}
                                onChange={(e) => setSelectedBarangay(e.target.value)}
                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                required
                            >
                                <option value="" disabled>Select Barangay</option>
                                {barangayList.map((barangay) => (
                                    <option key={barangay.brgy_code} value={barangay.brgy_code}>
                                        {barangay.brgy_name}
                                    </option>
                                ))}
                            </select>
                            <div className="mt-1 text-xs text-gray-600">
                                Please select the barangay where your organization is located.
                            </div>
                        </div>

                        {/* Full Address */}
                        <div className='w-full flex flex-col lg:col-span-2 mb-4'>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                House No./Unit No./Bldg/Floor, Street, Subdivision <span className="text-red-500">*</span>
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
                            <div className="mt-1 text-xs text-gray-600">
                                Please provide the full address including house number, unit number, building, floor, street, and subdivision.
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="col-span-2" />

                <div className="mb-4 col-span-2">
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                        Website or Social Media Account <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="website"
                        id="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md"
                        placeholder="Official website URL or social media account of the organization"
                        required
                    />
                    <div className="mt-1 text-xs text-gray-600">
                        Please provide the official website URL or a social media account link (e.g., Facebook, Instagram) of your organization.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step1;