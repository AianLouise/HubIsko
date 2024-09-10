// useTokenExpiry.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { signOut } from '../redux/user/userSlice'; // Adjust the import path

const useTokenExpiry = () => {
  const dispatch = useDispatch();

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const tokenExpiry = getCookie('tokenExpiry');
    console.log('Token Expiry Date:', tokenExpiry);

    const checkTokenExpiry = () => {
      if (!tokenExpiry) {
        handleSignOut();
        return;
      }

      const expiryDate = new Date(tokenExpiry);
      if (expiryDate <= new Date()) {
        handleSignOut();
      }
    };

    const intervalId = setInterval(checkTokenExpiry, 1000);

    return () => clearInterval(intervalId);
  }, []);
};

export default useTokenExpiry;