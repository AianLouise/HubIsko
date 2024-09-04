import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = ({ children }) => {
    const { currentUser } = useSelector((state) => state.user);

    if (currentUser) {
        // If the user is an admin, redirect to the admin dashboard
        if (currentUser.role === 'admin') {
            return <Navigate to="/admin-dashboard" />;
        }
        // If the user is a scholarship provider, redirect to the provider dashboard
        if (currentUser.role === 'scholarship_provider') {
            return <Navigate to="/provider-dashboard" />;
        }
        // If the user is an applicant, redirect to the home page
        // if (currentUser.role === 'applicant') {
        //     return <Navigate to="/" />;
        //   }
    }

    // If the user is not authenticated, render the children components
    return children;
};

export default PublicRoute;