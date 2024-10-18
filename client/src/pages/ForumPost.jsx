import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ForumPost from '../components/Forum/ForumPost';
import useTokenExpiry from '../hooks/useTokenExpiry'; // Adjust the import path

export default function CreateForumPost() {
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

    return (
        <div className='flex flex-col min-h-screen'>
            <Header />
            <main>
                <ForumPost />
            </main>
            <Footer />
        </div>
    );
}