import React, { useEffect, useState } from 'react';
import { faCheck, faTimes, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PasswordRequirements = ({ requirements }) => {
    return (
        <ul className="list-none p-0 mt-2">
            {requirements.map((req, index) => (
                <li
                    key={index}
                    className={`flex items-center gap-2 text-sm ${req.met ? 'text-green-500' : 'text-red-500'}`}
                >
                    <FontAwesomeIcon icon={req.met ? faCheck : faTimes} />
                    {req.text}
                </li>
            ))}
        </ul>
    );
};

const ConfirmPasswordRequirements = ({ requirements }) => {
    return (
        <ul className="list-none p-0 mt-2">
            {requirements.map((req, index) => (
                <li
                    key={index}
                    className={`flex items-center gap-2 text-sm ${req.met ? 'text-green-500' : 'text-red-500'}`}
                >
                    <FontAwesomeIcon icon={req.met ? faCheck : faTimes} />
                    {req.text}
                </li>
            ))}
        </ul>
    );
};

const Step2 = ({ formData, setFormData }) => {
    const [passwordRequirements, setPasswordRequirements] = useState([
        { text: 'Password must be at least 6 characters', met: false },
        { text: 'Password must contain at least one uppercase letter', met: false },
        { text: 'Password must contain at least one special character', met: false },
    ]);
    const [confirmPasswordRequirements, setConfirmPasswordRequirements] = useState([
        { text: 'Passwords must match', met: false },
    ]);
    const [isPasswordTouched, setIsPasswordTouched] = useState(false);
    const [isConfirmPasswordTouched, setIsConfirmPasswordTouched] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        // Scroll to the top of the page when the component is mounted
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));

        if (name === 'password') {
            if (!isPasswordTouched) {
                setIsPasswordTouched(true);
            }
            validatePassword(value);
        }

        if (name === 'confirmPassword') {
            if (!isConfirmPasswordTouched) {
                setIsConfirmPasswordTouched(true);
            }
            validateConfirmPassword(value);
        }
    };

    const validatePassword = (password) => {
        const requirements = [
            { text: 'Password must be at least 6 characters', met: password.length >= 6 },
            { text: 'Password must contain at least one uppercase letter', met: /[A-Z]/.test(password) },
            { text: 'Password must contain at least one special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
        ];
        setPasswordRequirements(requirements);
    };

    const validateConfirmPassword = (confirmPassword) => {
        const requirements = [
            { text: 'Passwords must match', met: confirmPassword === formData.password },
        ];
        setConfirmPasswordRequirements(requirements);
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    return (
        <div className='bg-white p-8 shadow rounded-md border max-w-4xl mx-auto'>
            <h2 className="text-2xl font-bold mb-6">Enter Account Information</h2>
            <div className='grid grid-cols-2 gap-4'>
                <div className="mb-4 col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md"
                        placeholder="Enter your email address"
                        required
                    />
                    <div className="mt-1 text-xs text-gray-600">
                        Please enter a valid email address. This will be used for account-related communications.
                    </div>
                </div>
                <div className="mb-4 col-span-2 relative">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border rounded-md pr-10"
                            placeholder="Choose a strong password"
                            required
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-blue-500 hover:underline"
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </button>
                    </div>
                    {isPasswordTouched && <PasswordRequirements requirements={passwordRequirements} />}
                    <div className="mt-1 text-xs text-gray-600">
                        Your password should be at least 6 characters long, contain at least one uppercase letter, and one special character.
                    </div>
                </div>
                <div className="mb-4 col-span-2 relative">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border rounded-md pr-10"
                            placeholder="Re-enter your password"
                            required
                        />
                        <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-blue-500 hover:underline"
                        >
                            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                        </button>
                    </div>
                    {isConfirmPasswordTouched && <ConfirmPasswordRequirements requirements={confirmPasswordRequirements} />}
                    <div className="mt-1 text-xs text-gray-600">
                        Please re-enter your password to confirm it matches the one you entered above.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step2;