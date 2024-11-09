import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer'; // Import the Footer component
import logo from '../assets/NewLogo.png'; // Adjust the path to your logo file
import useTokenExpiry from '../hooks/useTokenExpiry'; // Adjust the import path

export default function TermsOfUse() {
    useTokenExpiry();
    return (
        <div className="flex flex-col min-h-screen"> {/* Wrap content in a flex container */}
            <Header />
            <main className="flex-grow px-4 lg:px-0 max-w-2xl lg:mx-auto"> {/* Main content area */}
                <div className='my-10'>
                    <h1 className='text-3xl font-bold text-slate-800 mb-4'>Terms of Use</h1>
                    <div className='flex justify-center mb-6'>
                        <img src={logo} alt="Logo" className='w-24 h-24' />
                    </div>
                    <p className='mb-4 text-slate-700 text-justify'>
                        Welcome to HubIsko. By accessing or using our services, you agree to be bound by these terms of use. Please read them carefully.
                    </p>
                    <p className='mb-4 text-slate-700 text-justify'>
                        Our services are provided "as is" without warranties of any kind, either express or implied. We do not guarantee that our services will be uninterrupted or error-free.
                    </p>
                    <p className='mb-4 text-slate-700 text-justify'>
                        You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                    </p>
                    <p className='mb-4 text-slate-700 text-justify'>
                        You agree not to use our services for any unlawful or prohibited activities. You also agree not to interfere with the operation of our services or attempt to gain unauthorized access to our systems.
                    </p>
                    <p className='mb-4 text-slate-700 text-justify'>
                        We reserve the right to modify or terminate our services at any time without notice. We also reserve the right to modify these terms of use at any time. Your continued use of our services constitutes your acceptance of any changes to these terms.
                    </p>
                    <p className='mb-4 text-slate-700 text-justify'>
                        If you have any questions or concerns about these terms of use, please contact us.
                    </p>
                </div>
            </main>
            <Footer /> {/* Place the Footer component here */}
        </div>
    );
}