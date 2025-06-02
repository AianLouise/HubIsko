import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from "react-icons/fa";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const res = await fetch(`${apiUrl}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies in cross-origin requests
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      console.log(data);
      dispatch(signInSuccess(data));

      // Navigate to the Provider Dashboard if the user's role is scholarship_provider
      if (data.role === 'scholarship_provider') {
        navigate('/provider-dashboard');
      } else if (!data.emailVerified) {
        navigate('/verify-your-email', { state: { email: formData.email } });
      } else if (!data.applicantDetails.profileComplete) {
        // Navigate to the Complete Profile page if the applicant's profile is not complete
        navigate('/CoRH', { state: { userId: data._id } });
      } else {
        navigate('/');
      }
    } catch (error) {
      console.log('could not login with google', error);
    }
  };

  return (
    <button
      type='button'
      onClick={handleGoogleClick}
      className='border rounded-lg p-3 hover:bg-slate-200 flex flex-row items-center justify-center gap-4 font-medium transition-colors ease-in-out'
    >
      <FaGoogle className='text-blue-600' />
      <span>Google Account</span>
    </button>
  );
}