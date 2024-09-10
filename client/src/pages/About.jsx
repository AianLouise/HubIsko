import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer' // Import the Footer component
import useTokenExpiry from '../hooks/useTokenExpiry'; // Adjust the import path

export default function AboutUs() {
  useTokenExpiry();
  return (
    <div className="flex flex-col min-h-screen"> {/* Wrap content in a flex container */}
      <Header />
      <main className="flex-grow"> {/* Main content area */}
        <div className='px-4 py-12 max-w-2xl mx-auto'>
          <h1 className='text-3xl font-bold mb-4 text-slate-800'>About Us</h1>
          <p className='mb-4 text-slate-700'>
            At the heart of our Scholarship Management System is a commitment to
            empowering students and organizations in the pursuit of educational
            excellence. Our mission is to simplify the scholarship process, making
            education accessible to all. Our vision is to become the leading platform
            for scholarship management, where opportunities meet potential.
          </p>
          <p className='mb-4 text-slate-700'>
            Our team is composed of passionate educators, technologists, and advocates
            for higher education. We believe in the transformative power of education
            and are dedicated to removing financial barriers to academic achievement.
          </p>
          <p className='mb-4 text-slate-700'>
            With years of experience in the educational sector, our organization has
            developed a deep understanding of the challenges faced by students and
            scholarship providers. We've channeled this knowledge into creating a
            comprehensive system that addresses these challenges head-on, offering
            an intuitive, reliable, and efficient platform.
          </p>
          <p className='mb-4 text-slate-700'>
            Thank you for choosing to explore our Scholarship Management System. We
            are excited to support you on your journey to educational success!
          </p>
        </div>
      </main>
      <Footer /> {/* Place the Footer component here */}
    </div>
  );
}