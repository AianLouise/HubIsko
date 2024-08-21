import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";
import { BsPencilFill } from "react-icons/bs";
import { BsTrashFill } from "react-icons/bs";
import { BiCheck } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { BiCommentDots } from "react-icons/bi";
import { FaRegEye } from "react-icons/fa";
import Layout from "../../components/Layout";

export default function StudentDetails() {

  const [selectedTab, setSelectedTab] = useState('Student Information');

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

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

  const handleRegionChange = (e) => {
    const { value } = e.target;
    setApplicant((prevApplicant) => ({
      ...prevApplicant,
      applicantDetails: {
        ...prevApplicant.applicantDetails,
        regionCode: value,
      },
    }));
  };

  const handleProvinceChange = (e) => {
    const { value } = e.target;
    setApplicant((prevApplicant) => ({
      ...prevApplicant,
      applicantDetails: {
        ...prevApplicant.applicantDetails,
        provinceCode: value,
      },
    }));
  };

  const handleCityChange = (e) => {
    const { value } = e.target;
    setApplicant((prevApplicant) => ({
      ...prevApplicant,
      applicantDetails: {
        ...prevApplicant.applicantDetails,
        cityCode: value,
      },
    }));
  };

  const handleBarangayChange = (e) => {
    const { value } = e.target;
    setApplicant((prevApplicant) => ({
      ...prevApplicant,
      applicantDetails: {
        ...prevApplicant.applicantDetails,
        barangay: value,
      },
    }));
  };

  if (!applicant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen font-medium text-slate-700">
      <Layout />
      <main className="flex-grow bg-[#f8f8fb] pb-24">

        <div className='max-w-8xl mx-auto px-24 gap-10 flex-col flex mt-16'>

          <div className="flex gap-2 items-center">
            <Link to={'/students'} className="border shadow px-6 py-2 bg-white rounded-md hover:bg-slate-200">
              <span>Students</span>
            </Link>
            <IoMdArrowDropdown className='-rotate-90 w-8 h-8 text-blue-600' />

            <div className="border shadow px-6 py-2 bg-white rounded-md">
              <span className="text-blue-600">{`${applicant.applicantDetails.firstName} ${applicant.applicantDetails.lastName}`}</span>
            </div>
          </div>
        </div>

        <div className='border-b mb-8'>
          <div className={'flex items-center mx-auto px-24'}>
            <div className='flex items-center gap-6 w-1/2'>
              <div className='my-8'>
                <img
                  src={applicant.profilePicture} // Replace with the actual property name for the profile picture URL
                  alt="Profile Picture"
                  className='bg-blue-600 w-36 h-36 rounded-full object-cover'
                />
              </div>
              <div className="flex flex-col gap-4">
                <div className='text-4xl font-bold text-gray-800 flex items-center gap-4'>
                  Name: {`${applicant.applicantDetails.firstName} ${applicant.applicantDetails.lastName}`}
                  <div className="bg-blue-600 rounded-full">
                    <BiCheck className="w-8 h-8 text-white" />
                  </div>
                </div>
                <p className='text-lg text-slate-500 font-medium'>Followers: N</p>
              </div>
            </div>
          </div>
        </div>

        <div className='max-w-8xl mx-auto px-24 gap-10 flex-col flex mt-16'>

          <div className='flex flex-row gap-4 justify-between font-semibold mb-6'>
            <button
              className={`border text-center rounded-xl w-1/2 px-16 py-4 ${selectedTab === 'Student Information' ? 'bg-white shadow-md' : 'bg-slate-200 hover:bg-slate-300'}`}
              onClick={() => handleTabClick('Student Information')}
            >
              Student Information
            </button>

            <button
              className={`border text-center rounded-xl w-1/2 px-16 py-4 ${selectedTab === 'About' ? 'bg-white shadow-md' : 'bg-slate-200 hover:bg-slate-300'}`}
              onClick={() => handleTabClick('About')}
            >
              About
            </button>

            <button
              className={`border text-center rounded-xl w-1/2 px-16 py-4 ${selectedTab === 'Scholarships' ? 'bg-white shadow-md' : 'bg-slate-200 hover:bg-slate-300'}`}
              onClick={() => handleTabClick('Scholarships')}
            >
              Scholarships
            </button>
            <button
              className={`border text-center rounded-xl w-1/2 px-16 py-4 ${selectedTab === 'Posts' ? 'bg-white shadow-md' : 'bg-slate-200 hover:bg-slate-300'}`}
              onClick={() => handleTabClick('Posts')}
            >
              Posts
            </button>
          </div>


          {selectedTab === 'Student Information' && (
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
                    readOnly
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
                    readOnly
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
                    readOnly
                    className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Birthdate</label>
                  <input
                    type="text"
                    name="birthdate"
                    value={new Date(applicant.applicantDetails.birthdate).toLocaleDateString()}
                    readOnly
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
                    readOnly
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
                    readOnly
                    className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Blood Type</label>
                  <input
                    type="text"
                    name="bloodType"
                    value={applicant.applicantDetails.bloodType}
                    readOnly
                    className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Civil Status</label>
                  <input
                    type="text"
                    name="civilStatus"
                    value={applicant.applicantDetails.civilStatus}
                    readOnly
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
                    readOnly
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
                    readOnly
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
                    readOnly
                    className='standard-input border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Religion</label>
                  <input
                    type="text"
                    name="religion"
                    value={applicant.applicantDetails.religion}
                    readOnly
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
                      readOnly
                      className='text-sm standard-input border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full'
                      placeholder="Height in cm"
                    />

                    <input
                      type="number"
                      name="weight"
                      value={applicant.applicantDetails.weight}
                      onChange={handleInputChange}
                      required
                      readOnly
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
                    readOnly
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
                    readOnly
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
                    readOnly
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
                    readOnly
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
                    readOnly
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
                    readOnly
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
                    readOnly
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
          )}


          {selectedTab === 'About' && (
            <div className='border-2 rounded-md p-10 flex justify-center items-center bg-white h-96 mb-20'>
              <span>Container for About</span>
            </div>
          )}

          {selectedTab === 'Scholarships' && (
            <div className='border-2 rounded-md p-10 flex justify-center items-center bg-white h-96 mb-20'>
              <span>Container for Student's Scholarships</span>
            </div>
          )}

          {selectedTab === 'Posts' && (
            <div className='grid grid-cols-3 sm:grid-rows-1 gap-8'>
              <div className='bg-white font-normal border p-4 rounded-md flex flex-col hover:-translate-y-1 hover:shadow-lg transition ease-in-out'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, vel.
                <span className='text-sm flex items-end justify-end w-full text-slate-600'>Posted: July 7,2024</span>

                <div className='border-t mt-2'>
                  <div className='flex flex-row justify-between mt-2 gap-2'>


                    <div className='flex flex-row gap-2'>
                      <div className='flex flex-row gap-1 px-2'>
                        <FaRegHeart className='w-6 h-6 font-bold text-blue-600' />
                        <span>123</span>
                      </div>

                      <div className='flex flex-row gap-1'>
                        <BiCommentDots className='w-6 h-6 text-blue-600' />
                        <span>10</span>
                      </div>
                    </div>

                    <div className='flex flex-row gap-1 pr-2'>
                      <FaRegEye className='w-6 h-6 text-blue-600' />
                      <span>1.2k</span>
                    </div>

                  </div>
                </div>
              </div>



            </div>
          )}

        </div>
      </main>
    </div>
  );
}