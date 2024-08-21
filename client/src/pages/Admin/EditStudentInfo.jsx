import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BsPencilFill } from "react-icons/bs";


export default function EditStudentInfo() {

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
            email: '',
            contactNumber: '',
            addressDetails: '',
            region: '',
            province: '',
            barangay: '',
            addressDetails: '',
        },
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setApplicant((prevApplicant) => ({
            ...prevApplicant,
            applicantDetails: {
                ...prevApplicant.applicantDetails,
                [name]: value,
            },
        }));
    };

    return (
        <div className={`border text-center rounded-xl px-16 py-4`}>
            <div className="bg-white p-8 rounded-md shadow-md w-full">

                <div className="text-lg font-bold bg-slate-200 border-2 px-4 py-2 rounded-md">Student Information</div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="Enter your first name"
                            value={applicant.applicantDetails.firstName}
                            onChange={handleInputChange}
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
                            value={applicant.applicantDetails.lastName}
                            onChange={handleInputChange}
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
                            value={applicant.applicantDetails.middleName}
                            onChange={handleInputChange}
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
                            value={new Date(applicant.applicantDetails.birthdate).toLocaleDateString()}
                            onChange={handleInputChange}
                            required
                            className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Birthplace</label>
                        <input
                            type="text"
                            name="birthplace"
                            value={applicant.applicantDetails.birthplace}
                            onChange={handleInputChange}
                            required
                            className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                            placeholder="Enter birthplace"
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Gender</label>
                        <input
                            type="text"
                            name="gender"
                            value={applicant.applicantDetails.gender}
                            onChange={handleInputChange}
                            required
                            className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Blood Type</label>
                        <input
                            type="text"
                            name="bloodType"
                            value={applicant.applicantDetails.bloodType}
                            onChange={handleInputChange}
                            required
                            className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Civil Status</label>
                        <input
                            type="text"
                            name="civilStatus"
                            value={applicant.applicantDetails.civilStatus}
                            onChange={handleInputChange}
                            required
                            className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Maiden Name</label>
                        <input
                            type="text"
                            name="maidenName"
                            placeholder="Enter maiden name"
                            value={applicant.applicantDetails.maidenName}
                            onChange={handleInputChange}
                            className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Name of Spouse</label>
                        <input
                            type="text"
                            name="spouseName"
                            placeholder="Enter name of spouse"
                            value={applicant.applicantDetails.spouseName}
                            onChange={handleInputChange}
                            className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Occupation of Spouse</label>
                        <input
                            type="text"
                            name="spouseOccupation"
                            placeholder="Enter occupation of spouse"
                            value={applicant.applicantDetails.spouseOccupation}
                            onChange={handleInputChange}
                            className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Religion</label>
                        <input
                            type="text"
                            name="religion"
                            value={applicant.applicantDetails.religion}
                            onChange={handleInputChange}
                            required
                            className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                        />
                    </div>

                    <div className='flex flex-col'>
                        <label className='block text-sm font-medium text-slate-700 mb-2'>Height and Weight</label>
                        <div className='flex gap-2'>
                            <input
                                type="number"
                                name="height"
                                value={applicant.applicantDetails.height}
                                onChange={handleInputChange}
                                required
                                className='text-sm standard-input border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                placeholder="Height in cm"
                            />

                            <input
                                type="number"
                                name="weight"
                                value={applicant.applicantDetails.weight}
                                onChange={handleInputChange}
                                required
                                className='text-sm standard-input border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                                placeholder="Weight in kg"
                            />
                        </div>
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={applicant.email}
                            onChange={handleInputChange}
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
                            value={applicant.applicantDetails.contactNumber}
                            onChange={handleInputChange}
                            required
                            className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                            placeholder="Enter contact number"
                        />
                    </div>
                </div>

                <div className='grid grid-cols-2 gap-4 px-4 mt-3'>
                    <div className='col-span-1'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Region
                        </label>
                        <input
                            type="text"
                            name="region"
                            value={applicant.applicantDetails.address?.region}
                            onChange={handleInputChange}
                            required
                            className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                        />
                    </div>

                    <div className='col-span-1'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Province
                        </label>
                        <input
                            type="text"
                            name="province"
                            value={applicant.applicantDetails.address?.province}
                            onChange={handleInputChange}
                            required
                            className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                        />
                    </div>

                    <div className='col-span-1'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            City
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={applicant.applicantDetails.address?.city}
                            onChange={handleInputChange}
                            required
                            className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                        />
                    </div>

                    <div className='col-span-1'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Barangay
                        </label>
                        <input
                            type="text"
                            name="barangay"
                            value={applicant.applicantDetails.address?.barangay}
                            onChange={handleInputChange}
                            required
                            className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                        />
                    </div>

                    <div className='col-span-1'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            House No./Unit No./Bldg/Floor, Street, Subdivision
                        </label>
                        <input
                            type="text"
                            name="addressDetails"
                            value={applicant.applicantDetails.address?.addressDetails}
                            onChange={handleInputChange}
                            required
                            className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                        />
                    </div>
                </div>

                <div className="flex gap-2 justify-end">
                    <a href={`/edit-student-info/${applicant._id}`} className="px-6 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2">
                        <BsPencilFill className="w-4 h-4" />
                        Edit
                    </a>
                </div>
            </div>
        </div>
    )
}
