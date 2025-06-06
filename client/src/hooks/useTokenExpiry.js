import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../redux/user/userSlice'; // Adjust the import path

const useTokenExpiry = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };
  const handleSignOut = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const userId = currentUser ? currentUser._id : null;
    if (!userId) {
      console.log('User ID is not available4');
      return;
    }
    try {
      await fetch(`${apiUrl}/api/auth/signout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const tokenExpiry = getCookie('tokenExpiry');
    console.log('Token Expiry Date:', tokenExpiry);

    if (!tokenExpiry) {
      // Don't auto sign out if tokenExpiry is missing
      return;
    }

    const checkTokenExpiry = () => {
      const expiryDate = new Date(tokenExpiry);
      if (expiryDate <= new Date()) {
        handleSignOut();
        clearInterval(intervalId); // Clear the interval after sign-out
      }
    };

    const intervalId = setInterval(checkTokenExpiry, 1000);

    return () => clearInterval(intervalId);
  }, [currentUser]);

  return null; // This hook does not render anything
};

export default useTokenExpiry;