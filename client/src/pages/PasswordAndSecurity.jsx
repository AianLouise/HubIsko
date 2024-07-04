import React from 'react';
import Header from '../components/Header';
import AccountManagement from './AccountManagement';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

export default function PasswordAndSecurity() {
  return (
    <div>
        <Header />
        <AccountManagement />
        <div className="p-4">
          <h1>Password and Security</h1>
          <Link to="/change-password" className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">Change Password</Link>
        </div>
    </div>
  )
}