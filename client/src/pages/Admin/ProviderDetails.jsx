import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";
import { BiCheck } from "react-icons/bi";
import Layout from "../../components/Layout";
import ProviderDetailsEdit from "./ProviderDetailsEdit";
import ProviderAbout from "./ProviderAbout";
import ProviderScholarships from "./ProviderScholarships";
import ProviderForumPost from "./ProviderForumPost";

export default function ProviderDetails() {
  const { id } = useParams(); // Extract provider ID from URL parameters
  const [selectedTab, setSelectedTab] = useState('Organization Information');
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
              Forum Posts
            </button>
          </div>

          {selectedTab === 'Organization Information' && (
            <ProviderDetailsEdit provider={provider} />
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