import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function ScholarshipListing() {
  // Sample scholarship data
  const scholarships = [
    {
      id: 1,
      title: 'Engineering Excellence Scholarship',
      description: 'A scholarship for outstanding undergraduate engineering students.',
      eligibility: 'Undergraduate students in an accredited engineering program.',
      deadline: 'December 31, 2023',
    },
    {
      id: 2,
      title: 'Future Leaders in Medicine Scholarship',
      description: 'Supporting the next generation of medical professionals.',
      eligibility: 'First-year medical students with a passion for community service.',
      deadline: 'November 15, 2023',
    },
  ]

  return (
    <div className="flex flex-col min-h-screen"> {/* Wrap content in a flex container */}
      <Header />
      <main className="flex-grow"> {/* Main content area */}
        <div className='container mx-auto px-4'>
          <h1 className='text-2xl font-semibold text-gray-800 my-5'>Available Scholarships</h1>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {scholarships.map((scholarship) => (
              <div key={scholarship.id} className='border rounded-lg p-4 shadow-sm'>
                <h2 className='text-xl font-semibold'>{scholarship.title}</h2>
                <p>{scholarship.description}</p>
                <p><strong>Eligibility:</strong> {scholarship.eligibility}</p>
                <p><strong>Application Deadline:</strong> {scholarship.deadline}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}