import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { regions, provinces, cities, barangays } from 'select-philippines-address';

export default function StudentDetailsEdit() {
    const { id } = useParams();

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

    const [applicant, setApplicant] = useState({
        applicantDetails: {
            firstName: '',
            lastName: '',
            middleName: '',
            nameExtension: '',
            birthdate: '',
            birthplace: '',
            gender: '',
            bloodType: '',
            civilStatus: '',
            maidenName: '',
            spouseName: '',
            spouseOccupation: '',
            religion: '',
            height: '',
            weight: '',
            contactNumber: '',
            address: {
                region: '',
                province: '',
                city: '',
                barangay: '',
                addressDetails: '',
            }
        },
    });

    // console.log(applicant);

    const [isEditing, setIsEditing] = useState(false);
    const [notification, setNotification] = useState(''); // State for notification message

    const [formData, setFormData] = useState({
        applicantDetails: {
            firstName: '',
            lastName: '',
            middleName: '',
            birthdate: '',
            birthplace: '',
            gender: '',
            bloodType: '',
            civilStatus: '',
            maidenName: '',
            spouseName: '',
            spouseOccupation: '',
            religion: '',
            height: '',
            weight: '',
            contactNumber: '',
            address: {
                region: '',
                province: '',
                city: '',
                barangay: '',
                addressDetails: '',
            }
        }
    });

    // console.log(formData);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const [key, field] = name.split('.'); // Split the name into key and field

        setFormData((prevFormData) => ({
            ...prevFormData,
            [key]: {
                ...prevFormData[key],
                [field]: value,
            },
        }));
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };
    console.log(formData);

    const handleSaveChanges = async () => {
        // Validate form data
        const { applicantDetails } = formData;
        const { firstName, lastName, middleName, birthdate, birthplace, gender, bloodType, civilStatus, contactNumber, address } = applicantDetails;
        const { region, province, city, barangay, addressDetails } = address;

        if (!firstName || !lastName || !middleName || !birthdate || !birthplace || !gender || !bloodType || !civilStatus || !contactNumber || !region || !province || !city || !barangay || !addressDetails) {
            setNotification('Please fill in all required fields.');
            // Clear the notification after a few seconds
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
            setNotification('Student details updated successfully'); // Set success notification
        } catch (error) {
            console.error('Error updating student details:', error);
            setNotification('Error updating student details'); // Set error notification
        }

        // Clear the notification after a few seconds
        setTimeout(() => {
            setNotification('');
        }, 3000);
    };

    const handleCancel = () => {
        setFormData(applicant); // Revert changes
        setIsEditing(false);
    };

    if (!applicant) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-white p-8 rounded-md shadow-md w-full relative">
            <div className="text-lg font-bold bg-slate-200 border-2 px-4 py-2 rounded-md">Student Information</div>

            {notification && (
                <div className="fixed z-20 top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md">
                    {notification}
                </div>
            )}

            <form className='flex flex-col justify-between h-full'>
                <div className='gap-4 p-4'>
                    {/* All input fields */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="mb-4">
                            <label className='block text-sm font-medium text-gray-700 mb-2'>First Name</label>
                            <input
                                type="text"
                                name="applicantDetails.firstName"
                                placeholder="Enter your first name"
                                value={formData.applicantDetails.firstName}
                                onChange={handleInputChange}
                                readOnly={!isEditing}
                                required
                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                            />
                        </div>

                        <div className="mb-4">
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Last Name</label>
                            <input
                                type="text"
                                name="applicantDetails.lastName"
                                placeholder="Enter your last name"
                                value={formData.applicantDetails.lastName}
                                onChange={handleInputChange}
                                readOnly={!isEditing}
                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                            />
                        </div>

                        <div className="mb-4">
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Middle Name</label>
                            <input
                                type="text"
                                name="applicantDetails.middleName"
                                placeholder="Enter your middle name"
                                value={formData.applicantDetails.middleName}
                                onChange={handleInputChange}
                                readOnly={!isEditing}
                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                            />
                        </div>

                        <div className="mb-4">
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Name Extension</label>
                            <select
                                name="applicantDetails.nameExtension"
                                value={formData.applicantDetails.nameExtension}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                            >
                                <option value="">Select an extension</option>
                                <option value="Jr.">Jr.</option>
                                <option value="Sr.">Sr.</option>
                                <option value="II">II</option>
                                <option value="III">III</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="mb-4">
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Birthdate</label>
                            <input
                                type="date"
                                name="applicantDetails.birthdate"
                                placeholder="Enter your birthdate"
                                value={formData.applicantDetails.birthdate}
                                onChange={handleInputChange}
                                readOnly={!isEditing}
                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                            />
                        </div>

                        <div className="mb-4">
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Birthplace</label>
                            <input
                                type="text"
                                name="applicantDetails.birthplace"
                                placeholder="Enter your birthplace"
                                value={formData.applicantDetails.birthplace}
                                onChange={handleInputChange}
                                readOnly={!isEditing}
                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                            />
                        </div>

                        <div className="mb-4">
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Gender</label>
                            <select
                                name="applicantDetails.gender"
                                value={formData.applicantDetails.gender}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                            >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Blood Type</label>
                            <select
                                name="applicantDetails.bloodType"
                                value={formData.applicantDetails.bloodType}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                            >
                                <option value="">Select blood type</option>
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
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="mb-4">
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Civil Status</label>
                            <select
                                name="applicantDetails.civilStatus"
                                value={formData.applicantDetails.civilStatus}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                            >
                                <option value="">Select status</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Widowed">Widowed</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Maiden Name</label>
                            <input
                                type="text"
                                name="applicantDetails.maidenName"
                                placeholder="Enter your maiden name"
                                value={formData.applicantDetails.maidenName}
                                onChange={handleInputChange}
                                readOnly={!isEditing}
                                disabled={formData.applicantDetails.civilStatus !== 'Married'}
                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                            />
                        </div>

                        <div className="mb-4">
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Spouse Name</label>
                            <input
                                type="text"
                                name="applicantDetails.spouseName"
                                placeholder="Enter your spouse name"
                                value={formData.applicantDetails.spouseName}
                                onChange={handleInputChange}
                                readOnly={!isEditing}
                                disabled={formData.applicantDetails.civilStatus !== 'Married'}
                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                            />
                        </div>

                        <div className="mb-4">
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Spouse Occupation</label>
                            <input
                                type="text"
                                name="applicantDetails.spouseOccupation"
                                placeholder="Enter your spouse occupation"
                                value={formData.applicantDetails.spouseOccupation}
                                onChange={handleInputChange}
                                readOnly={!isEditing}
                                disabled={formData.applicantDetails.civilStatus !== 'Married'}
                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        <div className="col-span-1">
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Religion</label>
                            <select
                                name="applicantDetails.religion"
                                value={formData.applicantDetails.religion}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                            >
                                <option value="Roman Catholic">Roman Catholic</option>
                                <option value="Iglesia ni Cristo">Iglesia ni Cristo</option>
                                <option value="Islam">Islam</option>
                                <option value="Born Again Christian">Born Again Christian</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>

                        <div className="col-span-1">
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Height</label>
                            <input
                                type="number"
                                name="applicantDetails.height"
                                placeholder="Enter your height"
                                value={formData.applicantDetails.height}
                                onChange={handleInputChange}
                                readOnly={!isEditing}
                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                            />
                        </div>

                        <div className="col-span-1">
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Weight</label>
                            <input
                                type="number"
                                name="applicantDetails.weight"
                                placeholder="Enter your weight"
                                value={formData.applicantDetails.weight}
                                onChange={handleInputChange}
                                readOnly={!isEditing}
                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                            />
                        </div>

                        <div className="col-span-1">
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Contact Number</label>
                            <input
                                type="text"
                                name="applicantDetails.contactNumber"
                                placeholder="Enter your contact number"
                                value={formData.applicantDetails.contactNumber}
                                onChange={handleInputChange}
                                readOnly={!isEditing}
                                className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
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