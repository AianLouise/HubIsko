import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyEmailUpdate = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            const query = new URLSearchParams(location.search);
            const token = query.get('token');

            if (!token) {
                setMessage('Invalid verification link.');
                return;
            }

            try {
                const response = await fetch(`/api/provider/verify-email-update?token=${token}`, {
                    method: 'GET',
                });

                const data = await response.json();

                if (response.ok) {
                    setMessage('Email verified successfully. You can now log in.');
                    // Optionally, redirect to login page after a delay
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                } else {
                    setMessage(data.message || 'Error verifying email.');
                }
            } catch (error) {
                setMessage('Error verifying email.');
            }
        };

        verifyEmail();
    }, [location, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-md shadow-md">
                <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default VerifyEmailUpdate;