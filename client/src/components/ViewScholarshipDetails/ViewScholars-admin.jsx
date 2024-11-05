import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { BiFilter } from 'react-icons/bi';
import { CSVLink } from 'react-csv';
import { regions, provinces, cities, barangays } from 'select-philippines-address';

export default function ViewScholars({ scholars, numberOfScholarships, numberOfScholarshipsSlotFilled, approvedScholars }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('A-Z');
    const [csvData, setCsvData] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [addressNames, setAddressNames] = useState({});

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const toggleSortOrder = () => {
        setSortOrder((prevSortOrder) => (prevSortOrder === 'A-Z' ? 'Z-A' : 'A-Z'));
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const fetchAddressNames = async (scholar) => {
        const { region, province, city, barangay } = scholar.applicationDetails.applicant.applicantDetails.address;
        const address = {};

        if (region) {
            const regionList = await regions();
            const regionName = regionList.find((r) => r.region_code === region)?.region_name || '';
            address.regionName = regionName;
        }

        if (province) {
            const provinceList = await provinces(region);
            const provinceName = provinceList.find((p) => p.province_code === province)?.province_name || '';
            address.provinceName = provinceName;
        }

        if (city) {
            const cityList = await cities(province);
            const cityName = cityList.find((c) => c.city_code === city)?.city_name || '';
            address.cityName = cityName;
        }

        if (barangay) {
            const barangayList = await barangays(city);
            const barangayName = barangayList.find((b) => b.brgy_code === barangay)?.brgy_name || '';
            address.barangayName = barangayName;
        }

        return address;
    };

    useEffect(() => {
        const fetchAllAddressNames = async () => {
            const addressNamesMap = {};
            for (const scholar of scholars) {
                const address = await fetchAddressNames(scholar);
                addressNamesMap[scholar._id] = address;
            }
            setAddressNames(addressNamesMap);
        };

        fetchAllAddressNames();
    }, [scholars]);

    const generateCsvReport = () => {
        setIsGenerating(true);
        // Simulate CSV generation delay
        setTimeout(() => {
            const reportData = scholars.map((scholar) => {
                const address = addressNames[scholar._id] || {};
                const relatives = (scholar.applicationDetails?.relatives || []).slice(0, 6).map((relative, index) =>
                    `${relative.name} (${relative.relationship}, ${relative.birthdate ? formatDate(relative.birthdate) : ''})`
                ).join('; ');

                const workExperiences = (scholar.applicationDetails?.workExperience || []).map((experience, index) => {
                    const parts = [
                        experience.companyName,
                        experience.position,
                        experience.startDate ? formatDate(experience.startDate) : '',
                        experience.monthlySalary,
                        experience.statusOfAppointment
                    ].filter(part => part).join(', ');

                    return parts ? `${parts}` : '';
                }).filter(experience => experience).join('; ');

                const skillsAndQualifications = (scholar.applicationDetails?.skillsAndQualifications || []).slice(0, 6).map((skill, index) =>
                    `${skill.skills} (${skill.qualifications})`
                ).join('; ');

                const documents = Object.entries(scholar.applicationDetails?.documents || {}).map(([key, value]) => `${key}: ${value}`).join('; ');

                return {
                    Name: `${scholar.applicationDetails?.applicant?.applicantDetails?.lastName}, ${scholar.applicationDetails?.applicant?.applicantDetails?.firstName} ${scholar.applicationDetails?.applicant?.applicantDetails?.middleName ? scholar.applicationDetails.applicant.applicantDetails.middleName.charAt(0) + '.' : ''}`,
                    Email: scholar.applicationDetails?.applicant?.email,
                    DateOfBirth: formatDate(scholar.applicationDetails?.applicant?.applicantDetails?.birthdate),
                    Gender: scholar.applicationDetails?.applicant?.applicantDetails?.gender,
                    BloodType: scholar.applicationDetails?.applicant?.applicantDetails?.bloodType,
                    CivilStatus: scholar.applicationDetails?.applicant?.applicantDetails?.civilStatus,
                    Religion: scholar.applicationDetails?.applicant?.applicantDetails?.religion,
                    Height: scholar.applicationDetails?.applicant?.applicantDetails?.height,
                    Weight: scholar.applicationDetails?.applicant?.applicantDetails?.weight,
                    Birthplace: scholar.applicationDetails?.applicant?.applicantDetails?.birthplace,
                    ContactNumber: scholar.applicationDetails?.applicant?.applicantDetails?.contactNumber,
                    Address: `${address.regionName || ''}, ${address.provinceName || ''}, ${address.cityName || ''}, ${address.barangayName || ''}`,
                    ElementarySchool: scholar.applicationDetails?.applicant?.applicantDetails?.education?.elementary?.school,
                    ElementaryAward: scholar.applicationDetails?.applicant?.applicantDetails?.education?.elementary?.award,
                    ElementaryYearGraduated: scholar.applicationDetails?.applicant?.applicantDetails?.education?.elementary?.yearGraduated,
                    JuniorHighSchool: scholar.applicationDetails?.applicant?.applicantDetails?.education?.juniorHighSchool?.school,
                    JuniorHighAward: scholar.applicationDetails?.applicant?.applicantDetails?.education?.juniorHighSchool?.award,
                    JuniorHighYearGraduated: scholar.applicationDetails?.applicant?.applicantDetails?.education?.juniorHighSchool?.yearGraduated,
                    SeniorHighSchool: scholar.applicationDetails?.applicant?.applicantDetails?.education?.seniorHighSchool?.school,
                    SeniorHighAward: scholar.applicationDetails?.applicant?.applicantDetails?.education?.seniorHighSchool?.award,
                    SeniorHighYearGraduated: scholar.applicationDetails?.applicant?.applicantDetails?.education?.seniorHighSchool?.yearGraduated,
                    Course: scholar.applicationDetails?.applicant?.applicantDetails?.education?.college?.course,
                    College: scholar.applicationDetails?.applicant?.applicantDetails?.education?.college?.school,
                    FatherName: `${scholar.applicationDetails?.father?.firstName} ${scholar.applicationDetails?.father?.middleName ? scholar.applicationDetails.father.middleName.charAt(0) + '. ' : ''}${scholar.applicationDetails?.father?.lastName}`,
                    FatherOccupation: scholar.applicationDetails?.father?.occupation,
                    FatherBirthdate: scholar.applicationDetails?.father?.birthdate ? formatDate(scholar.applicationDetails.father.birthdate) : '',
                    FatherYearlyIncome: scholar.applicationDetails?.father?.yearlyIncome,
                    FatherContactNo: scholar.applicationDetails?.father?.contactNo,
                    MotherName: `${scholar.applicationDetails?.mother?.firstName} ${scholar.applicationDetails?.mother?.middleName ? scholar.applicationDetails.mother.middleName.charAt(0) + '. ' : ''}${scholar.applicationDetails?.mother?.lastName}`,
                    MotherOccupation: scholar.applicationDetails?.mother?.occupation,
                    MotherBirthdate: scholar.applicationDetails?.mother?.birthdate ? formatDate(scholar.applicationDetails.mother.birthdate) : '',
                    MotherYearlyIncome: scholar.applicationDetails?.mother?.yearlyIncome,
                    MotherContactNo: scholar.applicationDetails?.mother?.contactNo,
                    GuardianName: `${scholar.applicationDetails?.guardian?.firstName} ${scholar.applicationDetails?.guardian?.middleName ? scholar.applicationDetails.guardian.middleName.charAt(0) + '. ' : ''}${scholar.applicationDetails?.guardian?.lastName}`,
                    GuardianOccupation: scholar.applicationDetails?.guardian?.occupation,
                    GuardianBirthdate: scholar.applicationDetails?.guardian?.birthdate ? formatDate(scholar.applicationDetails.guardian.birthdate) : '',
                    GuardianYearlyIncome: scholar.applicationDetails?.guardian?.yearlyIncome,
                    GuardianContactNo: scholar.applicationDetails?.guardian?.contactNo,
                    Relatives: relatives,
                    WorkExperiences: workExperiences,
                    SkillsAndQualifications: skillsAndQualifications,
                    Documents: documents,
                    ScholarshipStatus: scholar.applicationDetails?.scholarshipProgram?.status,
                    ApplicationDate: formatDate(scholar.applicationDetails?.submissionDate),
                    ApplicationStatus: scholar.applicationDetails?.applicationStatus,
                };
            });

            setCsvData(reportData);
            setIsGenerating(false);
        }, 2000); // Simulate a delay for CSV generation
    };

    const filteredScholars = scholars
        .filter((scholar) => {
            const fullName = `${scholar.applicationDetails?.applicant?.applicantDetails?.lastName}, ${scholar.applicationDetails?.applicant?.applicantDetails?.firstName} ${scholar.applicationDetails?.applicant?.applicantDetails?.middleName ? scholar.applicationDetails.applicant.applicantDetails.middleName.charAt(0) + '.' : ''}`.toLowerCase();
            return fullName.includes(searchQuery.toLowerCase());
        })
        .sort((a, b) => {
            const nameA = `${a.applicationDetails?.applicant?.applicantDetails?.lastName}, ${a.applicationDetails?.applicant?.applicantDetails?.firstName} ${a.applicationDetails?.applicant?.applicantDetails?.middleName ? a.applicationDetails.applicant.applicantDetails.middleName.charAt(0) + '.' : ''}`.toLowerCase();
            const nameB = `${b.applicationDetails?.applicant?.applicantDetails?.lastName}, ${b.applicationDetails?.applicant?.applicantDetails?.firstName} ${b.applicationDetails?.applicant?.applicantDetails?.middleName ? b.applicationDetails.applicant.applicantDetails.middleName.charAt(0) + '.' : ''}`.toLowerCase();
            if (sortOrder === 'A-Z') {
                return nameA.localeCompare(nameB);
            } else {
                return nameB.localeCompare(nameA);
            }
        });

    return (
        <div className='h-screen'>
            <div className="p-6 bg-white rounded-lg shadow-md space-y-4 relative">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-blue-600">View Scholars</h2>
                        <p className="text-gray-700">
                            Here is the list of scholars enrolled in the program.
                        </p>
                    </div>
                    <div className="flex flex-col items-end text-gray-700 bg-white p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <FaCheckCircle className="text-blue-600 w-5 h-5" />
                            <strong className="text-gray-900">Slots Filled:</strong>
                            <span className="text-lg font-semibold text-blue-600">{approvedScholars}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaUsers className="text-blue-600 w-5 h-5" />
                            <strong className="text-gray-900">Total Scholarship Slot:</strong>
                            <span className="text-lg font-semibold text-blue-600">{numberOfScholarships}</span>
                        </div>
                    </div>
                </div>

                <div className="mb-4 flex justify-between items-center">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="border p-2 rounded-md w-full lg:w-1/2"
                    />
                    <div className='flex gap-2'>
                    <button
                className='flex gap-2 bg-white hover:bg-slate-200 px-6 py-2 border shadow rounded-md'
                onClick={toggleSortOrder}
            >
                <BiFilter className='w-6 h-6 text-blue-600' />
                <span>{sortOrder === 'A-Z' ? 'Sort Z-A' : 'Sort A-Z'}</span>
            </button>
            {/* <button
                className='flex gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 border shadow rounded-md'
                onClick={generateCsvReport}
                disabled={isGenerating}
            >
                {isGenerating ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                ) : (
                    <span>Generate CSV Report</span>
                )}
            </button> */}
            {!isGenerating && csvData.length > 0 && (
                <CSVLink
                    data={csvData}
                    filename={"scholar-report.csv"}
                    className="flex gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 border shadow rounded-md"
                >
                    <span>Download CSV</span>
                </CSVLink>
            )}
                    </div>
                </div>

                <div className='rounded-lg shadow-md border'>
                    <table className="min-w-full">
                        <thead>
                            <tr className='text-blue-600'>
                                <th className="py-2 px-4 border-b">Name</th>
                                <th className="py-2 px-4 border-b">Course</th>
                                {/* <th className="py-2 px-4 border-b">Actions</th> */}
                            </tr>
                        </thead>
                        <tbody className='text-center'>
                            {filteredScholars.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-2 px-4 border-b text-gray-500">No scholars found.</td>
                                </tr>
                            ) : (
                                filteredScholars.map((scholar) => (
                                    <tr key={scholar._id} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b">
                                            {`${scholar.applicationDetails.applicant.applicantDetails.lastName}, ${scholar.applicationDetails.applicant.applicantDetails.firstName} ${scholar.applicationDetails.applicant.applicantDetails.middleName ? scholar.applicationDetails.applicant.applicantDetails.middleName.charAt(0) + '.' : ''}`}
                                        </td>
                                        <td className="py-2 px-4 border-b">{scholar.applicationDetails.applicant.applicantDetails.education.college.course}</td>
                                        {/* <td className="py-2 px-4 border-b">
                                            <Link to={`/scholar-view/${scholar.applicationDetails._id}`} className="text-white bg-blue-600 px-4 py-1 rounded-md hover:bg-blue-800">
                                                View Details
                                            </Link>
                                        </td> */}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}