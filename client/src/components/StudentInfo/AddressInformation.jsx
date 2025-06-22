import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { RiEditFill, RiSaveFill, RiCloseFill } from "react-icons/ri";
import { regions, provinces, cities, barangays } from 'select-philippines-address';
import CustomNotification from "../CustomNotification";

const AddressInformation = () => {
    const { currentUser } = useSelector((state) => state.user);
    const userId = currentUser._id;

    const [isEditing, setIsEditing] = useState(false);
    const [originalFormData, setOriginalFormData] = useState(null);
    const [formData, setFormData] = useState({
        applicantDetails: {
            address: {
                region: '',
                province: '',
                city: '',
                barangay: '',
                addressDetails: '',
            }
        },
    });

    const [regionList, setRegionList] = useState([]);
    const [provinceList, setProvinceList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [barangayList, setBarangayList] = useState([]);

    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedBarangay, setSelectedBarangay] = useState('');

    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`/api/auth/user/${userId}`);
                if (!response.ok) {
                    throw new Error('Error fetching user details');
                }

                const user = await response.json();
                setFormData({
                    applicantDetails: {
                        address: {
                            region: user.applicantDetails.address.region,
                            province: user.applicantDetails.address.province,
                            city: user.applicantDetails.address.city,
                            barangay: user.applicantDetails.address.barangay,
                            addressDetails: user.applicantDetails.address.addressDetails,
                        },
                    },
                });
                setOriginalFormData({
                    applicantDetails: {
                        address: {
                            region: user.applicantDetails.address.region,
                            province: user.applicantDetails.address.province,
                            city: user.applicantDetails.address.city,
                            barangay: user.applicantDetails.address.barangay,
                            addressDetails: user.applicantDetails.address.addressDetails,
                        },
                    },
                });

                setSelectedRegion(user.applicantDetails.address.region);
                setSelectedProvince(user.applicantDetails.address.province);
                setSelectedCity(user.applicantDetails.address.city);
                setSelectedBarangay(user.applicantDetails.address.barangay);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, [userId]);

    useEffect(() => {
        regions().then(setRegionList);
    }, []);

    useEffect(() => {
        if (selectedRegion) {
            provinces(selectedRegion).then(setProvinceList);
        }
    }, [selectedRegion]);

    useEffect(() => {
        if (selectedProvince) {
            cities(selectedProvince).then(setCityList);
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedCity) {
            barangays(selectedCity).then(setBarangayList);
        }
    }, [selectedCity]);

    useEffect(() => {
        console.log('Selected City:', selectedCity);
        console.log('Barangay List:', barangayList);
    }, [selectedCity, barangayList]);

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleCancel = () => {
        setFormData(originalFormData);
        setErrors({}); // Clear the errors
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'barangay') {
            setSelectedBarangay(value);
        }
        setFormData({
            ...formData,
            applicantDetails: {
                ...formData.applicantDetails,
                address: {
                    ...formData.applicantDetails.address,
                    [name]: value,
                },
            },
        });
    };

    const handleSave = async () => {
        const newErrors = {};
        if (!selectedRegion || selectedRegion === '') newErrors.region = 'Region is required';
        if (!selectedProvince || selectedProvince === '') newErrors.province = 'Province is required';
        if (!selectedCity || selectedCity === '') newErrors.city = 'City is required';
        if (!selectedBarangay || selectedBarangay === '') newErrors.barangay = 'Barangay is required';
        if (!formData.applicantDetails.address.addressDetails) newErrors.addressDetails = 'Detailed address is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setNotification({ type: 'error', message: 'Please fill out all required fields' });
            return;
        }

        console.log('Saving address:', formData.applicantDetails.address);
        try {
            const response = await fetch(`/api/profile/user/${userId}/address`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    address: {
                        region: selectedRegion,
                        province: selectedProvince,
                        city: selectedCity,
                        barangay: selectedBarangay,
                        addressDetails: formData.applicantDetails.address.addressDetails,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error('Error updating address');
            }

            const result = await response.json();
            console.log(result.message);
            setOriginalFormData({
                applicantDetails: {
                    address: {
                        region: selectedRegion,
                        province: selectedProvince,
                        city: selectedCity,
                        barangay: selectedBarangay,
                        addressDetails: formData.applicantDetails.address.addressDetails,
                    },
                },
            });
            setErrors({}); // Clear errors after successful save
            setIsEditing(false);

            // Show success notification
            setNotification({
                type: 'success',
                message: 'Address updated successfully!'
            });
        } catch (error) {
            console.error('Error updating address:', error);

            // Show error notification
            setNotification({
                type: 'error',
                message: 'Failed to update address. Please try again.'
            });
        }
    };

    const handleCloseNotification = () => {
        setNotification(null);
    };    const inputBaseClasses = "block w-full p-2.5 rounded-md border transition duration-200 text-sm";
    const getInputClasses = (isEditing) => {
        return isEditing
            ? `${inputBaseClasses} border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm`
            : `${inputBaseClasses} bg-gray-100 border-gray-200 cursor-not-allowed`;
    };    return (
        <div className="bg-white w-full border border-gray-200 shadow-md rounded-lg overflow-hidden">
            {/* Professional Header */}            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-5">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white mb-1">Address Information</h2>
                            <p className="text-blue-100 text-sm">Manage your residential address details</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={isEditing ? handleSave : toggleEdit}
                            className="flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition-all duration-200 shadow-sm text-sm"
                        >
                            {isEditing ? <RiSaveFill className="text-base" /> : <RiEditFill className="text-base" />}
                            {isEditing ? 'Save Changes' : 'Edit Address'}
                        </button>
                        {isEditing && (
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md font-medium hover:bg-red-600 transition-all duration-200 shadow-sm text-sm"
                            >
                                <RiCloseFill className="text-base" />
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col px-4 lg:px-8 py-6 font-normal gap-3">
                {/* Region Selector */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Region <span className="text-red-500">*</span></label>
                    <select
                        value={selectedRegion}
                        onChange={(e) => {
                            setSelectedRegion(e.target.value);
                            setProvinceList([]); // Reset on region change
                            setCityList([]);
                            setBarangayList([]);
                            setSelectedProvince('');
                            setSelectedCity('');
                            setSelectedBarangay('');
                        }}
                        className={getInputClasses(isEditing)}
                        disabled={!isEditing}
                    >
                        <option value="">Select Region</option>
                        {regionList.map((region) => (
                            <option key={region.region_code} value={region.region_code}>
                                {region.region_name}
                            </option>
                        ))}
                    </select>
                    {errors.region && <p className="text-red-500 text-sm">{errors.region}</p>}
                </div>

                {/* Province Selector */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Province <span className="text-red-500">*</span></label>
                    <select
                        value={selectedProvince}
                        onChange={(e) => {
                            setSelectedProvince(e.target.value);
                            setCityList([]);
                            setBarangayList([]);
                            setSelectedCity('');
                            setSelectedBarangay('');
                        }}
                        className={getInputClasses(isEditing)}
                        disabled={!isEditing}
                    >
                        <option value="">Select Province</option>
                        {provinceList.map((province) => (
                            <option key={province.province_code} value={province.province_code}>
                                {province.province_name}
                            </option>
                        ))}
                    </select>
                    {errors.province && <p className="text-red-500 text-sm">{errors.province}</p>}
                </div>

                {/* City Selector */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City/Municipality <span className="text-red-500">*</span></label>
                    <select
                        value={selectedCity}
                        onChange={(e) => {
                            setSelectedCity(e.target.value);
                            setBarangayList([]);
                            setSelectedBarangay('');
                        }}
                        className={getInputClasses(isEditing)}
                        disabled={!isEditing}
                    >
                        <option value="">Select City</option>
                        {cityList.map((city) => (
                            <option key={city.city_code} value={city.city_code}>
                                {city.city_name}
                            </option>
                        ))}
                    </select>
                    {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                </div>

                {/* Barangay Selector */}
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Barangay <span className="text-red-500">*</span></label>
                    <select
                        value={selectedBarangay}
                        onChange={(e) => setSelectedBarangay(e.target.value)}
                        className={getInputClasses(isEditing)}
                        disabled={!isEditing}
                    >
                        <option value="">Select Barangay</option>
                        {barangayList.map((barangay) => (
                            <option key={barangay.brgy_code} value={barangay.brgy_code}>
                                {barangay.brgy_name}
                            </option>
                        ))}
                    </select>
                    {errors.barangay && <p className="text-red-500 text-sm">{errors.barangay}</p>}
                </div>

                {/* Address Details */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Address <span className="text-red-500">*</span></label>
                    <textarea
                        name="addressDetails"
                        value={formData.applicantDetails.address.addressDetails}
                        onChange={handleChange}
                        className={getInputClasses(isEditing)}
                        rows="4"
                        disabled={!isEditing}
                    />
                    {errors.addressDetails && <p className="text-red-500 text-sm">{errors.addressDetails}</p>}
                </div>
            </div>
            {notification && (
                <CustomNotification
                    type={notification.type}
                    message={notification.message}
                    onClose={handleCloseNotification}
                />
            )}
        </div>
    );
};

export default AddressInformation;