import React, { useState, useEffect } from 'react';
import { regions, provinces, cities, barangays } from 'select-philippines-address';

const UpdateInformation = ({ currentUser, dispatch, updateUserDetails }) => {
    const [regionList, setRegionList] = useState([]);
    const [provinceList, setProvinceList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [barangayList, setBarangayList] = useState([]);

    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedBarangay, setSelectedBarangay] = useState('');

    const [formData, setFormData] = useState({
        scholarshipProviderDetails: {
            organizationName: currentUser.scholarshipProviderDetails.organizationName,
            organizationType: currentUser.scholarshipProviderDetails.organizationType,
            contactPersonName: currentUser.scholarshipProviderDetails.contactPersonName,
            contactPersonPosition: currentUser.scholarshipProviderDetails.contactPersonPosition,
            contactPersonNumber: currentUser.scholarshipProviderDetails.contactPersonNumber,
            region: currentUser.scholarshipProviderDetails.region,
            province: currentUser.scholarshipProviderDetails.province,
            city: currentUser.scholarshipProviderDetails.city,
            addressDetails: currentUser.scholarshipProviderDetails.addressDetails,
            website: currentUser.scholarshipProviderDetails.website,
        },
    });

    const [notification, setNotification] = useState(null);

    const userId = currentUser._id;

    // Fetch all regions on component mount
    useEffect(() => {
        regions().then(setRegionList);
    }, []);

    // Fetch provinces when a region is selected
    useEffect(() => {
        if (selectedRegion) {
            provinces(selectedRegion).then(setProvinceList);
        }
    }, [selectedRegion]);

    // Fetch cities when a province is selected
    useEffect(() => {
        if (selectedProvince) {
            cities(selectedProvince).then(setCityList);
        }
    }, [selectedProvince]);

    // Fetch barangays when a city is selected
    useEffect(() => {
        if (selectedCity) {
            barangays(selectedCity).then(setBarangayList);
        }
    }, [selectedCity]);

    // Set initial location data
    useEffect(() => {
        const { region, province, city, barangay } = currentUser.scholarshipProviderDetails;
        setSelectedRegion(region);
        setSelectedProvince(province);
        setSelectedCity(city);
        setSelectedBarangay(barangay);
    }, [currentUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            scholarshipProviderDetails: {
                ...prevData.scholarshipProviderDetails,
                [name]: value,
            },
        }));
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        const updatedFormData = {
            ...formData,
            scholarshipProviderDetails: {
                ...formData.scholarshipProviderDetails,
                region: selectedRegion,
                province: selectedProvince,
                city: selectedCity,
                barangay: selectedBarangay,
                addressDetails: formData.scholarshipProviderDetails.addressDetails,
            },
        };

        console.log('Form Data:', updatedFormData);

        try {
            const response = await fetch(`/api/provider/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFormData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Response:', data);
            // Handle success (e.g., show a success message)
            // Dispatch the action to update the currentUser details in the Redux store
            dispatch(updateUserDetails(updatedFormData));
            setNotification('Information updated successfully!');
            setTimeout(() => setNotification(null), 3000); // Hide notification after 3 seconds
        } catch (error) {
            console.error('Error updating user information:', error);
            // Handle error (e.g., show an error message)
            setNotification('Error updating information.');
            setTimeout(() => setNotification(null), 3000); // Hide notification after 3 seconds
        }
    };

    return (
        <div className='bg-white border shadow rounded-md p-4'>
            {notification && (
                <div className='fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-md'>
                    {notification}
                </div>
            )}
            <h2 className='text-2xl font-bold mb-4'>Update Information</h2>
            <form onSubmit={handleSaveChanges}>
                <h2 className='text-xl font-semibold mb-4'>Organization Details</h2>
                <div className='mb-4'>
                    <label className='block text-xs font-medium text-gray-700'>Organization Name</label>
                    <input
                        type='text'
                        name='organizationName'
                        className='mt-1 p-2 border rounded-md w-full text-sm'
                        value={formData.scholarshipProviderDetails.organizationName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-xs font-medium text-gray-700'>Organization Type</label>
                    <select
                        name='organizationType'
                        id='organizationType'
                        value={formData.scholarshipProviderDetails.organizationType}
                        onChange={handleInputChange}
                        className='mt-1 p-2 border rounded-md w-full text-sm'
                        required
                    >
                        <option value='' disabled>Select organization type</option>
                        <option value='Government Agency'>Government Agency (e.g., federal, state, local agencies)</option>
                        <option value='Private Corporation'>Private Corporation (e.g., business, companies)</option>
                        <option value='Non-Governmental Organization'>Non-Governmental Organization (e.g., charities, non-profit organization/foundations)</option>
                        <option value='Educational Foundation'>Educational Foundation (e.g., schools, universities)</option>
                    </select>
                </div>
                <div className='mb-4'>
                    <label className='block text-xs font-medium text-gray-700'>Website</label>
                    <input
                        type='text'
                        name='website'
                        className='mt-1 p-2 border rounded-md w-full text-sm'
                        value={formData.scholarshipProviderDetails.website}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <h2 className='text-xl font-semibold mb-4'>Address</h2>
                <div className='mb-4'>
                    <label className='block text-xs font-medium text-gray-700 mb-2'>Region:</label>
                    <select
                        value={selectedRegion}
                        onChange={(e) => {
                            setSelectedRegion(e.target.value);
                            setProvinceList([]); // Reset on region change
                            setCityList([]);
                            setBarangayList([]);
                        }}
                        required
                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full text-sm'
                    >
                        <option value="">Select Region</option>
                        {regionList.map((region) => (
                            <option key={region.region_code} value={region.region_code}>
                                {region.region_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='mb-4'>
                    <label className='block text-xs font-medium text-gray-700 mb-2'>Province:</label>
                    <select
                        value={selectedProvince}
                        onChange={(e) => {
                            setSelectedProvince(e.target.value);
                            setCityList([]);
                            setBarangayList([]);
                        }}
                        required
                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full text-sm'
                    >
                        <option value="">Select Province</option>
                        {provinceList.map((province) => (
                            <option key={province.province_code} value={province.province_code}>
                                {province.province_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='mb-4'>
                    <label className='block text-xs font-medium text-gray-700 mb-2'>City/Municipality:</label>
                    <select
                        value={selectedCity}
                        onChange={(e) => {
                            setSelectedCity(e.target.value);
                            setBarangayList([]);
                        }}
                        required
                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full text-sm'
                    >
                        <option value="">Select City</option>
                        {cityList.map((city) => (
                            <option key={city.city_code} value={city.city_code}>
                                {city.city_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='mb-4'>
                    <label className='block text-xs font-medium text-gray-700 mb-2'>Barangay:</label>
                    <select
                        value={selectedBarangay}
                        onChange={(e) => setSelectedBarangay(e.target.value)}
                        required
                        className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full text-sm'
                    >
                        <option value="">Select Barangay</option>
                        {barangayList.map((barangay) => (
                            <option key={barangay.brgy_code} value={barangay.brgy_code}>
                                {barangay.brgy_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='mb-4'>
                    <label className='block text-xs font-medium text-gray-700'>Address Details</label>
                    <input
                        type='text'
                        name='addressDetails'
                        className='mt-1 p-2 border rounded-md w-full text-sm'
                        value={formData.scholarshipProviderDetails.addressDetails}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <h2 className='text-xl font-semibold mb-4'>Contact Person Details</h2>
                <div className='mb-4'>
                    <label className='block text-xs font-medium text-gray-700'>Contact Person Name</label>
                    <input
                        type='text'
                        name='contactPersonName'
                        className='mt-1 p-2 border rounded-md w-full text-sm'
                        value={formData.scholarshipProviderDetails.contactPersonName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-xs font-medium text-gray-700'>Contact Person Position</label>
                    <input
                        type='text'
                        name='contactPersonPosition'
                        className='mt-1 p-2 border rounded-md w-full text-sm'
                        value={formData.scholarshipProviderDetails.contactPersonPosition}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-xs font-medium text-gray-700'>Contact Person Number</label>
                    <input
                        type='text'
                        name='contactPersonNumber'
                        className='mt-1 p-2 border rounded-md w-full text-sm'
                        value={formData.scholarshipProviderDetails.contactPersonNumber}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded-md text-sm'>Save Changes</button>
            </form>
        </div>
    );
};

export default UpdateInformation;