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
        <div className='bg-white p-8 shadow rounded-md border max-w-4xl mx-auto'>
            <h2 className="text-2xl font-bold mb-6">Enter Organization Information</h2>
            <div className='grid grid-cols-2 gap-4'>
                <div className="mb-4 col-span-2">
                    <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 text-center mb-2">
                        Organization Image
                    </label>
                    <div className="flex flex-col items-center">
                        <input
                            type="file"
                            name="profilePicture"
                            id="profilePicture"
                            accept="image/*"
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
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">Organization Name</label>
                    <input
                        type="text"
                        name="organizationName"
                        id="organizationName"
                        value={formData.organizationName}
                        onChange={handleOrganizationNameChange}
                        className="mt-1 p-2 w-full border rounded-md"
                        placeholder="Full legal name of the organization"
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

                </div>

                <div className="mb-4">
                    <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">Registration Number</label>
                    <input
                        type="number"
                        name="registrationNumber"
                        id="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md"
                        placeholder="Official registration or incorporation number"
                    />
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
                            <input
                                type="number"
                                name="contactPersonNumber"
                                id="contactPersonNumber"
                                value={formData.contactPersonNumber}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border rounded-md"
                                placeholder="Direct contact number for the contact person"
                            />
                        </div>
                    </div>
                </div>
                <hr className="col-span-2" />
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Physical Address</label>

                    <div className='grid lg:grid-cols-2 gap-4 mt-4'>
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
                <hr className="col-span-2" />
                <div className="mb-4 col-span-2">
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
                    <input type="text" name="website" id="website" value={formData.website} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" placeholder="Official website URL of the organization" />

                </div>
            </div>
        </div>
    );
};

export default Step1;