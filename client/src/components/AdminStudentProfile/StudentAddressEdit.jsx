import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { regions, provinces, cities, barangays } from 'select-philippines-address';

export default function StudentAddressEdit() {
    const { id } = useParams();

    const [applicant, setApplicant] = useState({
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

    const [isEditing, setIsEditing] = useState(false);
    const [notification, setNotification] = useState(''); // State for notification message

    const [formData, setFormData] = useState({
        applicantDetails: {
            address: {
                region: '',
                province: '',
                city: '',
                barangay: '',
                addressDetails: '',
            }
        }
    });

    const [regionList, setRegionList] = useState([]);
    const [provinceList, setProvinceList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [barangayList, setBarangayList] = useState([]);

    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedBarangay, setSelectedBarangay] = useState('');

    useEffect(() => {
        const fetchApplicantDetails = async () => {
            try {
                const response = await fetch(`/api/admin/applicant/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setApplicant(data.applicant);
                setFormData(data.applicant); // Initialize formData with fetched data
            } catch (error) {
                console.error('Error fetching applicant details:', error);
            }
        };

        fetchApplicantDetails();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            applicantDetails: {
                ...prevData.applicantDetails,
                address: {
                    ...prevData.applicantDetails.address,
                    [name]: value,
                }
            }
        }));
    };

    const handleSaveChanges = async () => {
        const { address } = formData.applicantDetails;
        const { region, province, city, barangay, addressDetails } = address;

        if (!region || !province || !city || !barangay || !addressDetails) {
            setNotification('Please fill in all required fields.');
            setTimeout(() => {
                setNotification('');
            }, 3000);
            return;
        }

        try {
            const response = await fetch(`/api/admin/student/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const updatedData = await response.json();
            setApplicant(updatedData.user); // Update the applicant state with the updated data
            setIsEditing(false);
            setNotification('Address updated successfully'); // Set success notification
        } catch (error) {
            console.error('Error updating address:', error);
            setNotification('Error updating address'); // Set error notification
        }

        setTimeout(() => {
            setNotification('');
        }, 3000);
    };

    const handleCancel = () => {
        setFormData(applicant); // Revert changes
        setIsEditing(false);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

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
                applicantDetails: {
                    ...prevState.applicantDetails,
                    address: {
                        ...prevState.applicantDetails.address,
                        region: selectedRegion,
                        province: '',
                        city: '',
                        barangay: ''
                    }
                }
            }));
        }
    }, [selectedRegion]);

    // Fetch cities when a province is selected
    useEffect(() => {
        if (selectedProvince) {
            cities(selectedProvince).then(setCityList);
            setFormData(prevState => ({
                ...prevState,
                applicantDetails: {
                    ...prevState.applicantDetails,
                    address: {
                        ...prevState.applicantDetails.address,
                        province: selectedProvince,
                        city: '',
                        barangay: ''
                    }
                }
            }));
        }
    }, [selectedProvince]);

    // Fetch barangays when a city is selected
    useEffect(() => {
        if (selectedCity) {
            barangays(selectedCity).then(setBarangayList);
            setFormData(prevState => ({
                ...prevState,
                applicantDetails: {
                    ...prevState.applicantDetails,
                    address: {
                        ...prevState.applicantDetails.address,
                        city: selectedCity,
                        barangay: ''
                    }
                }
            }));
        }
    }, [selectedCity]);

    // Update formData when barangay is selected
    useEffect(() => {
        if (selectedBarangay) {
            setFormData(prevState => ({
                ...prevState,
                applicantDetails: {
                    ...prevState.applicantDetails,
                    address: {
                        ...prevState.applicantDetails.address,
                        barangay: selectedBarangay
                    }
                }
            }));
        }
    }, [selectedBarangay]);

    // Load initial data from formData
    useEffect(() => {
        if (!isEditing && formData && formData.applicantDetails && formData.applicantDetails.address) {
            const dummyData = {
                region: formData.applicantDetails.address.region,
                province: formData.applicantDetails.address.province,
                city: formData.applicantDetails.address.city,
                barangay: formData.applicantDetails.address.barangay,
            };

            setSelectedRegion(dummyData.region);
            setSelectedProvince(dummyData.province);
            setSelectedCity(dummyData.city);
            setSelectedBarangay(dummyData.barangay);
        }
    }, [formData]);

    if (!applicant) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-white p-8 rounded-md shadow-md w-full relative">
            <div className="text-lg font-bold bg-slate-200 border-2 px-4 py-2 rounded-md">Address</div>

            {notification && (
                <div className="fixed z-20 top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md">
                    {notification}
                </div>
            )}

            <form className='flex flex-col justify-between h-full'>
                <div className='gap-4 p-4'>
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
                                disabled={!isEditing}
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
                                disabled={!isEditing}
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
                                disabled={!isEditing}
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
                                disabled={!isEditing}
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
                                House No./Unit No./Bldg/Floor, Street, Subdivision
                            </label>
                            <label className='block lg:hidden text-sm font-medium text-gray-700 mb-2'>
                                Full Address
                            </label>
                            <input
                                type="text"
                                name="addressDetails"
                                value={formData.applicantDetails.address.addressDetails}
                                onChange={handleChange}
                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                placeholder="Enter House No./Unit No./Bldg/Floor, Street, Subdivision"
                                required
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-4">
                    {isEditing ? (
                        <>
                            <button
                                type="button"
                                onClick={handleSaveChanges}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={handleEditClick}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        >
                            Edit
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}