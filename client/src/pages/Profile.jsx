import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFail,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFail,
  signOut
} from '../redux/user/userSlice';
import Header from '../components/Header';
import AccountManagement from './AccountManagement';

import { IoPerson } from "react-icons/io5";
import { FaEye } from "react-icons/fa";


export default function Profile() {
  useEffect(() => {
    document.title = "Account Settings | HubIsko";
  }, []);

  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);


  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFail(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFail(error));
    }
  };

const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data);
        dispatch(deleteUserFail(data));
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFail(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <>
    <div className='bg-[#f8f8fb]'>
      <Header />
      <AccountManagement/>
      {/* max-w-6xl px-24 mx-auto flex justify-between items-center */}
      <div className='max-w-[950px] mx-auto flex flex-col gap-10 pt-10 '>
      <div className='bg-white shadow p-10 py-4 border rounded-md'>
        <h1 className='text-xl font-bold my-7 text-slate-700'>Profile Information</h1>
        <form onSubmit={handleSubmit} className='flex flex-col w-full gap-4 text-slate-700'>
          <input
            type='file'
            ref={fileRef}
            hidden
            accept='image/*'
            onChange={(e) => setImage(e.target.files[0])}
          />
          {/* 
      firebase storage rules:  
      allow read;
      allow write: if
      request.resource.size < 2 * 1024 * 1024 &&
      request.resource.contentType.matches('image/.*') */}
          <div className='flex flex-row items-center gap-8 border-b pb-4'>
          <img
            src={formData.profilePicture || currentUser.profilePicture}
            alt='profile'
            className='h-24 w-24 cursor-pointer border-4 border-blue-300 hover:border-blue-600 p-1 rounded-full object-cover mt-2 transition ease-in-out'
            onClick={() => fileRef.current.click()}
          />

            <div className='flex flex-col'>
              <span className='text-xl font-bold'>Profile Photo</span>
              <span className='opacity-70'>Click to upload a photo.</span>
            </div>
          
          </div>

          <p className='text-sm self-center'>
            {imageError ? (
              <span className='text-red-700'>
                Error uploading image (file size must be less than 2 MB)
              </span>
            ) : imagePercent > 0 && imagePercent < 100 ? (
              <span className='text-slate-700'>{`Uploading: ${imagePercent} %`}</span>
            ) : imagePercent === 100 ? (
              <span className='text-green-700'>Image uploaded successfully</span>
            ) : (
              ''
            )}
          </p>
          <div className='grid grid-cols-2 gap-x-10 gap-y-10'>
          <div className='flex flex-col gap-1'>
            <span className='font-medium text-slate-500'>Username</span>

          <input
            defaultValue={currentUser.username}
            type='text'
            id='username'
            placeholder='Username'
            className='bg-slate-100 rounded-lg p-3'
            onChange={handleChange}
          />

          </div>
          <div className='flex flex-col gap-1'>
          <span className='font-medium text-slate-500'>Name</span>
          <input
            defaultValue={currentUser.name}
            type='text'
            id='Name'
            placeholder='Name'
            className='bg-slate-100 rounded-lg p-3 w-full'
          />
          </div>

          <div className='flex flex-col gap-1'>
            <span className='font-medium text-slate-500'>Gender</span>
            
            <select name="Gender" id="Gender" className='bg-slate-100 rounded-lg p-3'>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
            
          </div>

          <div className='flex flex-col gap-1'>
            <span className='font-medium text-slate-500'>Birthday</span>

          <input
            
            type='Date'
            id='Bday'
            placeholder='Bday'
            className='bg-slate-100 rounded-lg p-3'
           
          />
          </div>

          <div className='flex flex-col gap-1'>
            <span className='font-medium text-slate-500'>Email</span>
          <input
            defaultValue={currentUser.email}
            type='email'
            id='email'
            placeholder='Email'
            className='bg-slate-100 rounded-lg p-3'
            onChange={handleChange}
          />
          </div>

          <div className='flex flex-col gap-1'>
            <span className='font-medium text-slate-500'>Location</span>
          <input
           
            type='text'
            id='Location'
            placeholder='Location'
            className='bg-slate-100 rounded-lg p-3'
            
          />
          </div>
        </div>
          
        <div className='w-full flex justify-end my-4'>

          <button className='bg-blue-600 px-14 font-medium text-white p-3 rounded-lg hover:bg-blue-800 disabled:bg-white disabled:border-2 transition ease-in-out'>
            {loading ? 'Loading...' : 'Update'}
          </button>
          
        </div>

      </form>

        <p className='text-red-700 mt-5'>{error && 'Something went wrong!'}</p>
        <p className='text-green-700 mt-5'>
          {updateSuccess && 'User is updated successfully!'}
        </p>
      </div>

    {/* PASSWORD AND SECURITY */}
      <div className='bg-white shadow w-full border flex flex-col p-10 h-auto rounded-md text-slate-700'>
      <h1 className='font-bold text-xl mb-8'>Password and Security</h1>
      
      <div className='grid grid-cols-2 gap-8'>

      <div className='flex flex-col gap-1'>
            <span className='font-medium text-slate-500'>Enter your password</span>
          <input
           
            type='Password'
            id='Password'
            placeholder='Password'
            className='bg-slate-100 rounded-lg p-3'
            
          />
      </div>

      <div className='flex flex-col gap-1'>
            <span className='font-medium text-slate-500'>Enter new password</span>
          <input
           
            type='Password'
            id='NewPassword'
            placeholder='New Password'
            className='bg-slate-100 rounded-lg p-3'
            
          />
      </div>

      <div className='flex flex-col gap-1'>
            <span className='font-medium text-slate-500'>Confirm Password</span>
          <input
           
            type='Password'
            id='ConfirmPassword'
            placeholder='Confirm Password'
            className='bg-slate-100 rounded-lg p-3'
            
          />
      </div>
      </div>
  
      <div className='w-full flex flex-row gap-4 justify-end my-4 mt-8'>
          
      <button className='flex flex-row items-center gap-2 border px-6 rounded-md p-3 font-medium hover:text-white hover:bg-blue-600 transition ease-in-out'>
      <FaEye />
          Show Passwords
      </button>

          <button className='bg-blue-600 px-10 font-medium text-white p-3 rounded-lg hover:bg-blue-800 disabled:bg-white disabled:border-2 transition ease-in-out'>
            {loading ? 'Loading...' : 'Change Password'}
          </button>
      </div>
      </div>


      {/* DELETE ACCOUNT */}
        <div className='bg-white shadow w-full border flex flex-col p-10 h-auto rounded-md mb-10 text-slate-700'>
        <h1 className='font-bold text-xl mb-8'>Delete your Account</h1>

        <div className='flex flex-col gap-4'>
        <span className='font-medium text-slate-500'>When you decide to delete your account, your information will be permanently lost in our website. You can cancel the deletion within 30 days.</span>
        
        <div className='flex flex-row gap-4 items-center pl-2'>
        <input type="checkbox" className='w-6 h-6 checked:bg-blue-100 hover:bg-blue-600'/>
        <div className='font-medium text-slate-500'>I confirm that I want my account deleted.</div>
        </div>
        
        <div className=' w-full flex flex-row gap-2 justify-end mt-4'>
            <button className='bg-white border-2 font-medium text-slate-700 p-2 px-4 rounded-md hover:bg-slate-200 transition ease-in-out'>Learn More</button>
            <button onClick={handleDeleteAccount} className='bg-red-500 font-medium text-white p-2 px-4 rounded-md hover:bg-red-700 transition ease-in-out'>Delete Account</button>
        </div>


      </div>
      </div>
    </div>
    </div>
    </>
  );
}