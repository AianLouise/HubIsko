import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../../redux/user/userSlice.js';

export default function ProviderDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Assuming you have a selector to get the current user's role
  // Update the path according to your state management setup
  const userRole = useSelector(state => state.user.role);

  useEffect(() => {
    // Redirect the user if their role is 'applicant'
    if (userRole === 'applicant') {
      navigate('/unauthorized'); // Redirect to an unauthorized page or home
    }
  }, [userRole, navigate]);

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signOut());
      console.log('Signed out successfully');
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-5 font-sans">
      {/* Your component content */}
    </div>
  );
}