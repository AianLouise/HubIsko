import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { regions, provinces, cities, barangays } from 'select-philippines-address';

const LocationSelector = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const userId = currentUser._id;

    const [regionList, setRegionList] = useState([]);
    const [provinceList, setProvinceList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [barangayList, setBarangayList] = useState([]);

    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedBarangay, setSelectedBarangay] = useState('');

    const [formData, setFormData] = useState({});

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

    // Save the selected location to the formData state
    const handleSave = () => {
        const locationData = {
            region: selectedRegion,
            province: selectedProvince,
            city: selectedCity,
            barangay: selectedBarangay,
        };

        // Log the form data to the console
        console.log('Form Data:', locationData);

        // Save the location data in formData state
        setFormData(locationData);
    };

    // Set dummy data for location
    useEffect(() => {
        const dummyData = {
            region: '03',
            province: '0349',
            city: '034904',
            barangay: '034904004',
        };

        setSelectedRegion(dummyData.region);
        setSelectedProvince(dummyData.province);
        setSelectedCity(dummyData.city);
        setSelectedBarangay(dummyData.barangay);
    }, []);

    return (
        <div>
            <h2>Select Location</h2>

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

            <button onClick={handleSave} className='mt-4 bg-blue-600 text-white p-2 rounded-md'>Save Location</button>

            {/* Display form data for debugging */}
            <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-inner">
                <h3 className="text-lg font-bold mb-2">Form Data</h3>
                <pre className="text-sm text-gray-700">
                    {JSON.stringify(formData, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default LocationSelector;