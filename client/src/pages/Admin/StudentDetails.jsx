import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoMdArrowDropdown, IoMdPeople } from "react-icons/io";
import { BsPencilFill } from "react-icons/bs";
import { BsTrashFill } from "react-icons/bs";
import { BiCheck } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { BiCommentDots } from "react-icons/bi";
import { FaRegEye } from "react-icons/fa";
import Layout from "../../components/Layout";
import StudentDetailsEdit from "./StudentDetailsEdit";
import StudentScholarship from "./StudentScholarship";
import StudentForumPost from "./StudentForumPost";
import { PiStudentFill } from "react-icons/pi";

export default function StudentDetails() {

  const [selectedTab, setSelectedTab] = useState('Student Information');

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
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

  if (!applicant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen font-medium text-slate-700">

      <main className="flex-grow bg-[#f8f8fb] pb-24">
        <div className='max-w-8xl mx-auto px-24 gap-10 flex-col flex mt-16'>
          <div className="flex gap-2 items-center">
            <Link to={'/accounts'} className="border shadow px-6 py-2 bg-white rounded-md hover:bg-slate-200 flex items-center gap-2">
              <IoMdPeople className="w-6 h-6 text-blue-600" />
              <span>Accounts</span>
            </Link>
            <IoMdArrowDropdown className='-rotate-90 w-8 h-8 text-blue-600' />

            <div className="border shadow px-6 py-2 bg-white rounded-md flex items-center gap-2">
              <PiStudentFill className="w-6 h-6 text-blue-600" />
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
                <div className='text-xl font-semibold text-gray-600'>
                  {applicant.role === 'applicant' ? 'Student' : applicant.role}
                </div>
                <div className='text-4xl font-bold text-gray-800 flex items-center gap-4'>
                  {`${applicant.applicantDetails.firstName} ${applicant.applicantDetails.lastName}`}
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
              className={`border text-center rounded-xl w-1/2 px-16 ${selectedTab === 'Student Information' ? 'bg-white shadow-md' : 'bg-slate-200 hover:bg-slate-300'}`}
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
            <StudentDetailsEdit />
          )}


          {selectedTab === 'About' && (
            <div className='border-2 rounded-md p-10 flex justify-center items-center bg-white h-96 mb-20'>
              <span>Container for About</span>
            </div>
          )}

          {selectedTab === 'Scholarships' && (
            <StudentScholarship />
          )}

          {selectedTab === 'Posts' && (
            <StudentForumPost />
          )}

        </div>
      </main>
    </div>
  );
}