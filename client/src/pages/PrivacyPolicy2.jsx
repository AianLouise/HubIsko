import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer'; // Import the Footer component
import logo from '../assets/NewLogo.png'; // Adjust the path to your logo file
import useTokenExpiry from '../hooks/useTokenExpiry'; // Adjust the import path

export default function PrivacyPolicy() {
  useTokenExpiry();
  return (
    <div className="flex flex-col min-h-screen"> {/* Wrap content in a flex container */}
      <Header />
      <main className="flex-grow px-4 lg:px-0 max-w-2xl lg:mx-auto"> {/* Main content area */}
        <div className='my-10'>
          <h1 className='text-3xl font-bold text-slate-800 mb-4'>Privacy Policy</h1>
          <div className='flex justify-center mb-6'>
            <img src={logo} alt="Logo" className='w-24 h-24' />
          </div>
          <p className='mb-4 text-slate-700 text-justify'>
            This is the privacy policy page. At HubIsko, we are committed to protecting your privacy. This policy outlines our practices regarding the collection, use, and disclosure of your information.
          </p>
          <p className='mb-4 text-slate-700 text-justify'>
            We collect personal information that you provide to us directly, such as when you create an account, apply for scholarships, or contact us for support. This information may include your name, email address, phone number, and other details necessary for providing our services.
          </p>
          <p className='mb-4 text-slate-700 text-justify'>
            We use your information to provide and improve our services, communicate with you, and ensure the security of our platform. We may also use your information for research and analytics purposes to better understand our users and enhance our offerings.
          </p>
          <p className='mb-4 text-slate-700 text-justify'>
            We do not share your personal information with third parties except as necessary to provide our services, comply with legal obligations, or protect our rights. We implement appropriate security measures to safeguard your information and prevent unauthorized access.
          </p>
          <p className='mb-4 text-slate-700 text-justify'>
            By using our services, you consent to the collection, use, and disclosure of your information as described in this privacy policy. If you have any questions or concerns about our privacy practices, please contact us.
          </p>
        </div>
      </main>
      <Footer /> {/* Place the Footer component here */}
    </div>
  );
}