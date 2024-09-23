import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { IoMdArrowDropdown, IoMdPeople } from "react-icons/io";
import { BiCheck } from "react-icons/bi";
import Layout from "../../components/Layout";
// import ProviderAccountEdit from "../../components/AdminProviderProfile/ProviderAccountEdit";
import ProviderDetailsEdit from "../../components/AdminProviderProfile/ProviderDetailsEdit";
import ProviderAddressEdit from "../../components/AdminProviderProfile/ProviderAddressEdit";
import ProviderAbout from "./ProviderAbout";
import ProviderScholarships from "./ProviderScholarships";
import ProviderForumPost from "./ProviderForumPost";
import { BsBuildingFill } from "react-icons/bs";

export default function ProviderDetails() {
  const { id } = useParams(); // Extract provider ID from URL parameters
  const [selectedTab, setSelectedTab] = useState('Organization Information');
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProviderDetails = async () => {
      try {
        const response = await fetch(`/api/adminProfile/provider/${id}`); // Adjust the URL as necessary
        const data = await response.json();
        setProvider(data);
      } catch (error) {
        console.error('Error fetching provider details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviderDetails();
  }, [id]);

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!provider) {
    return <div>Provider not found</div>;
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
              <BsBuildingFill className="w-6 h-6 text-blue-600" />
              <span className="text-blue-600">{`${provider.scholarshipProviderDetails.organizationName}`}</span>
            </div>
          </div>
        </div>
        <div className='border-b mb-8'>
          <div className={'flex items-center mx-auto px-24'}>
            <div className='flex items-center gap-6 w-1/2'>
              <div className='w-36 h-36 my-8 rounded-full overflow-hidden'>
                <img src={provider.profilePicture} alt="Profile" className='w-full h-full object-cover' />
              </div>
              <div className="flex flex-col gap-4">
                <div className='text-xl font-semibold text-gray-600'>
                  {provider.role === 'scholarship_provider' ? 'Scholarship Provider' : provider.role}
                </div>
                <div className='text-4xl font-bold text-gray-800 flex items-center gap-4'>
                  {provider.scholarshipProviderDetails.organizationName}
                  <div className="bg-blue-600 rounded-full">
                    <BiCheck className="w-8 h-8 text-white" />
                  </div>
                </div>
                <p className='text-lg text-slate-500 font-medium'>Scholars: {provider.scholarsCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className='max-w-8xl mx-auto px-24 gap-10 flex-col flex mt-16'>
          <div className='flex flex-row gap-4 justify-between font-semibold mb-6'>
            <button
              className={`border text-center rounded-xl w-1/2 px-16 py-4 ${selectedTab === 'Organization Information' ? 'bg-white shadow-md' : 'bg-slate-200 hover:bg-slate-300'}`}
              onClick={() => handleTabClick('Organization Information')}
            >
              Organization Information
            </button>

            {/* <button
              className={`border text-center rounded-xl w-1/2 px-16 py-4 ${selectedTab === 'About' ? 'bg-white shadow-md' : 'bg-slate-200 hover:bg-slate-300'}`}
              onClick={() => handleTabClick('About')}
            >
              About
            </button> */}

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
              Forum Posts
            </button>
          </div>

          {selectedTab === 'Organization Information' && (
            <>
              {/* <ProviderAccountEdit provider={provider} /> */}
              <ProviderDetailsEdit provider={provider} />
              <ProviderAddressEdit provider={provider} />
            </>
          )}

          {selectedTab === 'About' && (
            <ProviderAbout provider={provider} />
          )}

          {selectedTab === 'Scholarships' && (
            <ProviderScholarships provider={provider} />
          )}

          {selectedTab === 'Posts' && (
            <ProviderForumPost provider={provider} />
          )}
        </div>
      </main>
    </div>
  );
}