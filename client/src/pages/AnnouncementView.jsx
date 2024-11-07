import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AnnouncementDetails from '../components/Announcement/AnnouncementDetails';
import useTokenExpiry from '../hooks/useTokenExpiry'; // Adjust the import path

export default function AnnouncementView() {
    useTokenExpiry();

    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        if (currentUser) {
            if (currentUser.role === 'admin') {
                navigate('/admin-dashboard');
            } else if (currentUser.role === 'scholarship_provider') {
                if (!currentUser.emailVerified) {
                    navigate('/verify-your-email', { state: { email: currentUser.email } });
                } else {
                    navigate('/provider-dashboard');
                }
            }
        }
    }, [currentUser, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
    });

    return (
        <div className='flex flex-col min-h-screen'>
            <Header />
            <main>
                <AnnouncementDetails />
            </main>
            <Footer />
        </div>
    );
}