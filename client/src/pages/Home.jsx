import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen"> {/* Flex container */}
      <Header />
      <main className="flex-grow"> {/* Main content grows to fill available space */}
        <div className='px-4 py-12 max-w-2xl mx-auto'>
          <h1 className='text-3xl font-bold mb-4 text-slate-800'>
            Welcome to the Scholarship Management System!
          </h1>
          <p className='mb-4 text-slate-700'>
            Our comprehensive scholarship management system is designed to streamline
            the process of finding, applying for, and managing scholarships. Whether
            you're a student seeking financial assistance or an organization looking
            to provide scholarships, our platform offers a suite of tools to simplify
            your journey.
          </p>
          <p className='mb-4 text-slate-700'>
            Key Features:
            <ul className='list-disc ml-8'>
              <li>Easy scholarship discovery with personalized recommendations.</li>
              <li>Streamlined application process to save you time.</li>
              <li>Tools for organizations to manage applications and select recipients.</li>
              <li>Secure and transparent handling of your data.</li>
            </ul>
          </p>
          <p className='mb-4 text-slate-700'>
            Benefits:
            <ul className='list-disc ml-8'>
              <li>Maximize your scholarship opportunities with minimal effort.</li>
              <li>Stay organized with dashboard overviews and timely alerts.</li>
              <li>Access a wide network of scholarship providers and applicants.</li>
              <li>Get support from our dedicated team every step of the way.</li>
            </ul>
          </p>
          <p className='mb-4 text-slate-700'>
            Ready to take the next step in your educational journey? Register or log in now
            to explore all the features our scholarship management system has to offer!
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}