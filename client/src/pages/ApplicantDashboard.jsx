import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ApplicantDashboard() {
  return (
    <div className="flex flex-col min-h-screen"> {/* Flex container */}
      <Header />
      <main className="flex-grow"> {/* Main content grows to fill available space */}
        <div className='px-4 py-12 max-w-4xl mx-auto'>
          <h1 className='text-3xl font-bold mb-4 text-slate-800'>
            Applicant Dashboard
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Overview of current applications */}
            <div className="bg-white shadow p-4 rounded-lg">
              <h2 className="font-semibold text-xl mb-2">Current Applications</h2>
              {/* Application items */}
            </div>

            {/* Profile Management */}
            <div className="bg-white shadow p-4 rounded-lg col-span-1 md:col-span-2">
              <h2 className="font-semibold text-xl mb-2">Profile Management</h2>
              <div className="space-y-4">
                {/* Edit personal details */}
                <div>
                  <h3 className="font-medium text-lg">Edit Personal Details</h3>
                  {/* Form fields */}
                </div>
                {/* Upload documents */}
                <div>
                  <h3 className="font-medium text-lg">Upload Documents</h3>
                  {/* Upload fields */}
                </div>
                {/* Academic history and GPA */}
                <div>
                  <h3 className="font-medium text-lg">Academic History and GPA</h3>
                  {/* Form fields */}
                </div>
                {/* Change password and security settings */}
                <div>
                  <h3 className="font-medium text-lg">Change Password & Security</h3>
                  {/* Form fields */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}