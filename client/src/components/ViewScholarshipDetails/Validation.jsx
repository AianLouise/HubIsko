import React, { useEffect, useState } from 'react';
import { FaCheck, FaCog, FaPlay, FaPlus, FaTimes, FaTrashAlt } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPaperPlane, FaEdit } from 'react-icons/fa';

export default function Validation() {
    const { id } = useParams();
    const scholarshiProgramId = id;
    const navigate = useNavigate();

    // Validation Form Fields
    const [validations, setValidations] = useState([]);
    const [validationTitle, setValidationTitle] = useState('');
    const [validationDescription, setValidationDescription] = useState('');
    const [validationMethod, setValidationMethod] = useState('');
    // Face-to-Face
    const [sessionDate, setSessionDate] = useState('');
    const [location, setLocation] = useState('');
    // Courier-Based
    const [recipientName, setRecipientName] = useState('');
    const [recipientContact, setRecipientContact] = useState('');
    const [mailingAddress, setMailingAddress] = useState('');
    const [submissionDeadline, setSubmissionDeadline] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingValidationId, setEditingValidationId] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Fetch Validations
    const fetchValidations = async () => {
        try {
            const response = await fetch(`/api/validation/program/${scholarshiProgramId}`);
            if (response.ok) {
                const data = await response.json();
                setValidations(data);
            } else {
                console.error("Failed to fetch validations");
            }
        } catch (error) {
            console.error("Error fetching validations:", error);
        }
    };

    useEffect(() => {
        fetchValidations();
    }, [scholarshiProgramId]);

    const handleButtonClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setRequirements([]); // Clear requirements when modal is closed
        setRequirementInput(''); // Optionally clear the input field as well
        setValidationTitle(''); // Optionally clear the title field as well
        setValidationDescription(''); // Optionally clear the description field as well
        setValidationMethod(''); // Clear the validation method field as well
        setSessionDate(''); // Clear the session date field as well
        setLocation(''); // Clear the location field as well
        setMailingAddress(''); // Clear the mailing address field as well
        setRecipientName(''); // Clear the recipient name field as well
        setRecipientContact(''); // Clear the recipient contact field as well
        setSubmissionDeadline(''); // Clear the submission deadline field as well
    };

    const handleCloseModal2 = () => {
        setIsEditModalOpen(false);
        setRequirements([]); // Clear requirements when modal is closed
        setRequirementInput(''); // Optionally clear the input field as well
        setValidationTitle(''); // Optionally clear the title field as well
        setValidationDescription(''); // Optionally clear the description field as well
        setValidationMethod(''); // Clear the validation method field as well
        setSessionDate(''); // Clear the session date field as well
        setLocation(''); // Clear the location field as well
        setMailingAddress(''); // Clear the mailing address field as well
        setRecipientName(''); // Clear the recipient name field as well
        setRecipientContact(''); // Clear the recipient contact field as well
        setSubmissionDeadline(''); // Clear the submission deadline field as well
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            id: scholarshiProgramId,
            validationTitle,
            validationDescription,
            requirements,
            validationMethod,
            faceToFaceDetails: validationMethod === 'Face-to-Face' ? { sessionDate, location } : undefined,
            courierDetails: validationMethod === 'Courier-Based' ? { mailingAddress, recipientName, recipientContact, submissionDeadline } : undefined
        };
        try {
            const response = await fetch("/api/validation/validations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                console.log("Form data submitted successfully");
                // Optionally, close the modal after submission
                setIsModalOpen(false);
                setRequirements([]); // Clear requirements after submission
                setRequirementInput(''); // Optionally clear the input field as well
                setValidationTitle(''); // Optionally clear the title field as well
                setValidationDescription(''); // Optionally clear the description field as well
                setValidationMethod(''); // Optionally clear the validation method field as well
                setSessionDate(''); // Optionally clear the session date field as well
                setLocation(''); // Optionally clear the location field as well
                setMailingAddress(''); // Optionally clear the mailing address field as well
                setRecipientName(''); // Optionally clear the recipient name field as well
                setRecipientContact(''); // Optionally clear the recipient contact field as well
                setSubmissionDeadline(''); // Optionally clear the submission deadline field as well
                fetchValidations(); // Refresh validations
            } else {
                const errorData = await response.json();
                console.error("Failed to submit form data:", errorData);
            }
        } catch (error) {
            console.error("Error submitting form data:", error);
        }
    };

    const handlePostValidation = async (validationId) => {
        try {
            const response = await fetch(`/api/validation/${validationId}/post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                console.log('Validation posted successfully');
                // Optionally, update the state to reflect the change
                setValidations(validations.map(validation =>
                    validation._id === validationId ? { ...validation, status: 'Posted' } : validation
                ));
                fetchValidations(); // Refresh validations
            } else {
                console.error('Failed to post validation');
            }
        } catch (error) {
            console.error('Error posting validation:', error);
        }
    };

    const handleEditValidation = (validationId) => {
        const validationToEdit = validations.find(validation => validation._id === validationId);
        if (validationToEdit) {
            setValidationTitle(validationToEdit.validationTitle);
            setValidationDescription(validationToEdit.validationDescription);
            setRequirements(validationToEdit.requirements.map(req => req.requirement));
            setValidationMethod(validationToEdit.validationMethod);

            if (validationToEdit.validationMethod === 'Face-to-Face' && validationToEdit.faceToFaceDetails) {
                setSessionDate(validationToEdit.faceToFaceDetails.sessionDate);
                setLocation(validationToEdit.faceToFaceDetails.location);
            } else {
                setSessionDate('');
                setLocation('');
            }

            if (validationToEdit.validationMethod === 'Courier-Based' && validationToEdit.courierDetails) {
                setMailingAddress(validationToEdit.courierDetails.mailingAddress);
                setRecipientName(validationToEdit.courierDetails.recipientName);
                setRecipientContact(validationToEdit.courierDetails.recipientContact);
                setSubmissionDeadline(validationToEdit.courierDetails.submissionDeadline);
            } else {
                setMailingAddress('');
                setRecipientName('');
                setRecipientContact('');
                setSubmissionDeadline('');
            }

            setEditingValidationId(validationId);
            setIsEditModalOpen(true);
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();

        const updatedValidation = {
            validationTitle,
            validationDescription,
            requirements: requirements.map(req => ({ requirement: req })),
            validationMethod,
            faceToFaceDetails: validationMethod === 'Face-to-Face' ? { sessionDate, location } : undefined,
            courierDetails: validationMethod === 'Courier-Based' ? { mailingAddress, recipientName, recipientContact, submissionDeadline } : undefined
        };

        try {
            const response = await fetch(`/api/validation/validations/${editingValidationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedValidation)
            });

            if (response.ok) {
                const updatedValidations = validations.map(validation =>
                    validation._id === editingValidationId ? { ...validation, ...updatedValidation } : validation
                );
                setValidations(updatedValidations);
                setIsEditModalOpen(false);
                fetchValidations(); // Refresh validations
            } else {
                console.error('Failed to update validation');
            }
        } catch (error) {
            console.error('Error updating validation:', error);
        }
    };

    const handleDeleteValidation = async (validationId) => {
        try {
            const response = await fetch(`/api/validation/delete/${validationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'Deleted' })
            });

            if (response.ok) {
                setValidations(validations.map(validation =>
                    validation._id === validationId ? { ...validation, status: 'Deleted' } : validation
                ));
            } else {
                console.error('Failed to update validation status');
            }
        } catch (error) {
            console.error('Error updating validation status:', error);
        }
    };

    const handleMarkAsDone = async (validationId) => {
        try {
            const response = await fetch(`/api/validation/${validationId}/done`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setValidations(validations.map(validation =>
                    validation._id === validationId ? { ...validation, status: 'Done' } : validation
                ));
                fetchValidations(); // Refresh validations
            } else {
                console.error('Failed to update validation status');
            }
        } catch (error) {
            console.error('Error updating validation status:', error);
        }
    };

    const handleStartValidation = async (validationId) => {
        try {
            const response = await fetch(`/api/validation/${validationId}/start`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to start validation');
            }

            const data = await response.json();
            console.log(data.message);

            // Optionally, refetch validations to update the UI
            await fetchValidations();
        } catch (error) {
            console.error('Error starting validation:', error);
        }
    };

    const handleManageValidation = (validationId) => {
        // Navigate to the scholars page for the specific validation
        navigate(`/validation/${validationId}/scholars`);
    };

    const [requirements, setRequirements] = useState([]);
    const [requirementInput, setRequirementInput] = useState('');
    const [showInput, setShowInput] = useState(false);

    const handleAddRequirement = () => {
        setShowInput(true);
    };

    const handleSaveRequirement = () => {
        if (requirementInput.trim()) {
            setRequirements([...requirements, requirementInput]);
            setRequirementInput('');
            setShowInput(false);
        }
    };

    const handleRemoveRequirement = (index) => {
        const newRequirements = requirements.filter((_, i) => i !== index);
        setRequirements(newRequirements);
    };

    const pendingValidations = validations.filter(validation => validation.status === 'Pending');
    const upcomingValidations = validations.filter(validation => validation.status === 'Upcoming');
    const ongoingValidations = validations.filter(validation => validation.status === 'Ongoing');
    const doneValidations = validations.filter(validation => validation.status === 'Done');

    return (
        <>
            <div className="p-6 bg-white rounded-lg shadow-md ">
                <div className='flex flex-col justify-between items-start'>
                    <div className='flex justify-between items-center w-full'>
                        <div>
                            <h2 className="text-2xl font-bold text-blue-600">Validation</h2>
                            <p className="text-gray-700 mb-4">
                                This page allows you to manage and review validation results for your scholarship programs.
                                You can approve or reject validation results, and keep track of the status of each validation.
                            </p>
                        </div>
                        <div>
                            <button
                                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                                onClick={handleButtonClick}
                            >
                                Create Validation
                            </button>
                        </div>
                    </div>
                </div>

                {/* Upcoming Document Validation Content */}
                <h3 className='text-xl font-bold tracking-wide mt-4'>Pending Document Validation</h3>
                <div className="p-6">
                    {pendingValidations.length === 0 ? (
                        <p className='bg-slate-200 text-slate-600 px-8 py-4 rounded-md text-left'>No pending document validations at the moment.</p>
                    ) : (
                        pendingValidations.map((validation) => (
                            <div key={validation._id} className='bg-white border-l-4 border-l-blue-500 text-black-700 p-6 rounded-md border shadow relative mb-6'>
                                <div className='flex justify-between items-center mb-4'>
                                    <h3 className='text-xl font-semibold'>{validation.validationTitle}</h3>
                                    <span className={`inline-block px-3 py-1 rounded-full text-white ${validation.status === 'posted' ? 'bg-green-600' : 'bg-blue-600'}`}>
                                        Status: {validation.status}
                                    </span>
                                </div>
                                <p className='mb-4 text-gray-700'>{validation.validationDescription}</p>
                                <div className='mb-4'>
                                    <p className='font-medium text-gray-800'>Requirements Needed:</p>
                                    <ul className='list-disc pl-5'>
                                        {validation.requirements.map((req, index) => (
                                            <li key={index} className='mb-2 text-gray-700'>
                                                {req.requirement}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className='mb-4'>
                                    <p className='font-medium text-gray-800'>Validation Method: {validation.validationMethod}</p>
                                    {validation.validationMethod === 'Face-to-Face' && validation.faceToFaceDetails && (
                                        <div className='pl-5 mt-2'>
                                            <p className='text-gray-700'>Date & Time: {validation.faceToFaceDetails.sessionDate}</p>
                                            <p className='text-gray-700'>Location: {validation.faceToFaceDetails.location}</p>
                                        </div>
                                    )}
                                    {validation.validationMethod === 'Courier-Based' && validation.courierDetails && (
                                        <div className='pl-5 mt-2'>
                                            <p className='text-gray-700'>Mailing Address: {validation.courierDetails.mailingAddress}</p>
                                            <p className='text-gray-700'>Recipient Name: {validation.courierDetails.recipientName}</p>
                                            <p className='text-gray-700'>Recipient Contact: {validation.courierDetails.recipientContact}</p>
                                            <p className='text-gray-700'>Submission Deadline: {new Date(validation.courierDetails.submissionDeadline).toLocaleDateString()}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between items-end mt-4">
                                    <div className="flex space-x-4">
                                        <button
                                            className="bg-green-600 text-white py-2 px-4 rounded flex items-center hover:bg-green-700 transition duration-300"
                                            onClick={() => handlePostValidation(validation._id)}
                                        >
                                            <FaPaperPlane className="mr-2" />
                                            <span>Post Validation</span>
                                        </button>
                                        <button
                                            className="bg-yellow-600 text-white py-2 px-4 rounded flex items-center hover:bg-yellow-700 transition duration-300"
                                            onClick={() => handleEditValidation(validation._id)}
                                        >
                                            <FaEdit className="mr-2" />
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            className="bg-red-600 text-white py-2 px-4 rounded flex items-center hover:bg-red-700 transition duration-300"
                                            onClick={() => handleDeleteValidation(validation._id)}
                                        >
                                            <FaTrashAlt className="mr-2" />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                    <div className='text-right'>
                                        <p className='text-gray-600'>
                                            Date Created: {new Date(validation.dateCreated).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {new Date(validation.dateCreated).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Upcoming Document Validation Content */}
                <h3 className='text-xl font-bold tracking-wide mt-4'>Upcoming Document Validation</h3>
                <div className="p-6">
                    {upcomingValidations.length === 0 ? (
                        <p className='bg-slate-200 text-slate-600 px-8 py-4 rounded-md text-left'>No upcoming document validations at the moment.</p>
                    ) : (
                        upcomingValidations.map((validation) => (
                            <div key={validation._id} className='bg-white border-l-4 border-l-blue-500 text-black-700 p-6 rounded-md border shadow relative mb-6'>
                                <div className='flex justify-between items-center mb-4'>
                                    <h3 className='text-xl font-semibold'>{validation.validationTitle}</h3>
                                    <span className={`inline-block px-3 py-1 rounded-full text-white ${validation.status === 'posted' ? 'bg-green-600' : 'bg-blue-600'}`}>
                                        Status: {validation.status}
                                    </span>
                                </div>
                                <p className='mb-4 text-gray-700'>{validation.validationDescription}</p>
                                <div className='mb-4'>
                                    <p className='font-medium text-gray-800'>Requirements Needed:</p>
                                    <ul className='list-disc pl-5'>
                                        {validation.requirements.map((req, index) => (
                                            <li key={index} className='mb-2 text-gray-700'>
                                                {req.requirement}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className='mb-4'>
                                    <p className='font-medium text-gray-800'>Validation Method: {validation.validationMethod}</p>
                                    {validation.validationMethod === 'Face-to-Face' && validation.faceToFaceDetails && (
                                        <div className='pl-5 mt-2'>
                                            <p className='text-gray-700'>Date & Time: {validation.faceToFaceDetails.sessionDate}</p>
                                            <p className='text-gray-700'>Location: {validation.faceToFaceDetails.location}</p>
                                        </div>
                                    )}
                                    {validation.validationMethod === 'Courier-Based' && validation.courierDetails && (
                                        <div className='pl-5 mt-2'>
                                            <p className='text-gray-700'>Mailing Address: {validation.courierDetails.mailingAddress}</p>
                                            <p className='text-gray-700'>Recipient Name: {validation.courierDetails.recipientName}</p>
                                            <p className='text-gray-700'>Recipient Contact: {validation.courierDetails.recipientContact}</p>
                                            <p className='text-gray-700'>Submission Deadline: {new Date(validation.courierDetails.submissionDeadline).toLocaleDateString()}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between items-end mt-4">
                                    <div className="flex space-x-4">
                                        <button
                                            className="bg-yellow-600 text-white py-2 px-4 rounded flex items-center hover:bg-yellow-700 transition duration-300"
                                            onClick={() => handleEditValidation(validation._id)}
                                        >
                                            <FaEdit className="mr-2" />
                                            <span>Edit</span>
                                        </button>
                                        {validation.status === 'Upcoming' && (
                                            <button
                                                className="bg-green-600 text-white py-2 px-4 rounded flex items-center hover:bg-green-700 transition duration-300"
                                                onClick={() => handleStartValidation(validation._id)}
                                            >
                                                <FaPlay className="mr-2" />
                                                <span>Start Validation</span>
                                            </button>
                                        )}
                                    </div>
                                    <div className='text-right'>
                                        {validation.datePosted && (
                                            <p className='text-gray-600'>
                                                Date Posted: {new Date(validation.datePosted).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {new Date(validation.datePosted).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Ongoing Document Validation Content */}
                <h3 className='text-xl font-bold tracking-wide mt-4'>Ongoing Document Validation</h3>
                <div className="p-6">
                    {ongoingValidations.length === 0 ? (
                        <p className='bg-slate-200 text-slate-600 px-8 py-4 rounded-md text-left'>No ongoing document validations at the moment.</p>
                    ) : (
                        ongoingValidations.map((validation) => (
                            <div key={validation._id} className='bg-white border-l-4 border-l-blue-500 text-black-700 p-6 rounded-md border shadow relative mb-6'>
                                <div className='flex justify-between items-center mb-4'>
                                    <h3 className='text-xl font-semibold'>{validation.validationTitle}</h3>
                                    <span className={`inline-block px-3 py-1 rounded-full text-white ${validation.status === 'posted' ? 'bg-green-600' : 'bg-blue-600'}`}>
                                        Status: {validation.status}
                                    </span>
                                </div>
                                <p className='mb-4 text-gray-700'>{validation.validationDescription}</p>
                                <div className='mb-4'>
                                    <p className='font-medium text-gray-800'>Requirements Needed:</p>
                                    <ul className='list-disc pl-5'>
                                        {validation.requirements.map((req, index) => (
                                            <li key={index} className='mb-2 text-gray-700'>
                                                {req.requirement}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className='mb-4'>
                                    <p className='font-medium text-gray-800'>Validation Method: {validation.validationMethod}</p>
                                    {validation.validationMethod === 'Face-to-Face' && validation.faceToFaceDetails && (
                                        <div className='pl-5 mt-2'>
                                            <p className='text-gray-700'>Date & Time: {validation.faceToFaceDetails.sessionDate}</p>
                                            <p className='text-gray-700'>Location: {validation.faceToFaceDetails.location}</p>
                                        </div>
                                    )}
                                    {validation.validationMethod === 'Courier-Based' && validation.courierDetails && (
                                        <div className='pl-5 mt-2'>
                                            <p className='text-gray-700'>Mailing Address: {validation.courierDetails.mailingAddress}</p>
                                            <p className='text-gray-700'>Recipient Name: {validation.courierDetails.recipientName}</p>
                                            <p className='text-gray-700'>Recipient Contact: {validation.courierDetails.recipientContact}</p>
                                            <p className='text-gray-700'>Submission Deadline: {new Date(validation.courierDetails.submissionDeadline).toLocaleDateString()}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between items-end mt-4">
                                    <div className="flex space-x-4">
                                        <button
                                            className="bg-yellow-600 text-white py-2 px-4 rounded flex items-center hover:bg-yellow-700 transition duration-300"
                                            onClick={() => handleEditValidation(validation._id)}
                                        >
                                            <FaEdit className="mr-2" />
                                            <span>Edit</span>
                                        </button>
                                        {validation.status === 'Upcoming' && (
                                            <button
                                                className="bg-red-600 text-white py-2 px-4 rounded flex items-center hover:bg-red-700 transition duration-300"
                                                onClick={() => handleMarkAsDone(validation._id)}
                                            >
                                                <FaCheck className="mr-2" />
                                                <span>Mark as Done</span>
                                            </button>
                                        )}
                                        {validation.status === 'Ongoing' && (
                                            <button
                                                className="bg-blue-600 text-white py-2 px-4 rounded flex items-center hover:bg-blue-700 transition duration-300"
                                                onClick={() => handleManageValidation(validation._id)}
                                            >
                                                <FaCog className="mr-2" />
                                                <span>Manage Validation</span>
                                            </button>
                                        )}
                                    </div>
                                    <div className='text-right'>
                                        {validation.datePosted && (
                                            <p className='text-gray-600'>
                                                Date Posted: {new Date(validation.datePosted).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {new Date(validation.datePosted).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Previous Document Validation Content */}
                <h3 className='text-xl font-bold tracking-wide mt-4'>Previous Document Validation</h3>
                <div className="p-6">
                    {doneValidations.length === 0 ? (
                        <p className='bg-slate-200 text-slate-600 px-8 py-4 rounded-md text-left'>No previous document validations at the moment.</p>
                    ) : (
                        doneValidations.map((validation) => (
                            <div key={validation._id} className='bg-white border-l-4 border-l-blue-500 text-black-700 p-6 rounded-md border shadow relative mb-6'>
                                <div className='flex justify-between items-center mb-4'>
                                    <h3 className='text-xl font-semibold'>{validation.validationTitle}</h3>
                                    <span className={`inline-block px-3 py-1 rounded-full text-white ${validation.status === 'posted' ? 'bg-green-600' : 'bg-blue-600'}`}>
                                        Status: {validation.status}
                                    </span>
                                </div>
                                <p className='mb-4 text-gray-700'>{validation.validationDescription}</p>
                                <div className='mb-4'>
                                    <p className='font-medium text-gray-800'>Requirements Needed:</p>
                                    <ul className='list-disc pl-5'>
                                        {validation.requirements.map((req, index) => (
                                            <li key={index} className='mb-2 text-gray-700'>
                                                {req.requirement}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className='mb-4'>
                                    <p className='font-medium text-gray-800'>Validation Method: {validation.validationMethod}</p>
                                    {validation.validationMethod === 'Face-to-Face' && validation.faceToFaceDetails && (
                                        <div className='pl-5 mt-2'>
                                            <p className='text-gray-700'>Date & Time: {validation.faceToFaceDetails.sessionDate}</p>
                                            <p className='text-gray-700'>Location: {validation.faceToFaceDetails.location}</p>
                                        </div>
                                    )}
                                    {validation.validationMethod === 'Courier-Based' && validation.courierDetails && (
                                        <div className='pl-5 mt-2'>
                                            <p className='text-gray-700'>Mailing Address: {validation.courierDetails.mailingAddress}</p>
                                            <p className='text-gray-700'>Recipient Name: {validation.courierDetails.recipientName}</p>
                                            <p className='text-gray-700'>Recipient Contact: {validation.courierDetails.recipientContact}</p>
                                            <p className='text-gray-700'>Submission Deadline: {new Date(validation.courierDetails.submissionDeadline).toLocaleDateString()}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between items-end mt-4">
                                    <div className="flex space-x-4">
                                        {/* No actions for previous validations */}
                                    </div>
                                    <div className='text-right'>
                                        {validation.dateDone && (
                                            <p className='text-gray-600'>
                                                Date Done: {new Date(validation.dateDone).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {new Date(validation.dateDone).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-2/4 relative max-h-[80vh] overflow-y-auto">
                            <button
                                className="absolute top-2 right-4 text-gray-700 hover:text-gray-900 text-2xl"
                                onClick={handleCloseModal}
                            >
                                &times;
                            </button>
                            <h3 className="text-xl font-bold mb-4">Post Validation</h3>
                            <form onSubmit={handleSubmit}>
                                {/* Validation Title */}
                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700 text-sm font-medium mb-2"
                                        htmlFor="validationTitle"
                                    >
                                        Validation Title
                                    </label>
                                    <input
                                        type="text"
                                        id="validationTitle"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={validationTitle}
                                        onChange={(e) => setValidationTitle(e.target.value)}
                                        placeholder="Enter validation title"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700 text-sm font-medium mb-2"
                                        htmlFor="validationDescription"
                                    >
                                        Validation Description
                                    </label>
                                    <input
                                        type="text"
                                        id="validationDescription"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={validationDescription}
                                        onChange={(e) => setValidationDescription(e.target.value)}
                                        placeholder="Enter validation description"
                                        required
                                    />
                                </div>

                                {/* Validation Method Dropdown */}
                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700 text-sm font-medium mb-2"
                                        htmlFor="validationMethod"
                                    >
                                        Validation Method
                                    </label>
                                    <select
                                        id="validationMethod"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={validationMethod}
                                        onChange={(e) => setValidationMethod(e.target.value)}
                                        required
                                    >
                                        <option value="">Select a method</option>
                                        <option value="Face-to-Face">Face-to-Face</option>
                                        <option value="Courier-Based">Courier-Based</option>
                                    </select>
                                </div>

                                {/* Conditional Fields for Face-to-Face */}
                                {validationMethod === "Face-to-Face" && (
                                    <>
                                        <div className="mb-4">
                                            <label
                                                className="block text-gray-700 text-sm font-medium mb-2"
                                                htmlFor="sessionDate"
                                            >
                                                Date & Time
                                            </label>
                                            <input
                                                type="text"
                                                id="sessionDate"
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                value={sessionDate}
                                                onChange={(e) => setSessionDate(e.target.value)}
                                                placeholder="Enter date and time"
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label
                                                className="block text-gray-700 text-sm font-medium mb-2"
                                                htmlFor="location"
                                            >
                                                Location
                                            </label>
                                            <input
                                                type="text"
                                                id="location"
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                placeholder="Enter location"
                                                required
                                            />
                                        </div>
                                        {/* Requirements Section */}
                                        <div className="mb-4">
                                            <div className="flex justify-between items-center">
                                                <label
                                                    className="block text-gray-700 text-sm font-medium mb-2"
                                                    htmlFor="requirements"
                                                >
                                                    Requirements
                                                </label>
                                                <button
                                                    type="button"
                                                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-all ease-in-out duration-300"
                                                    onClick={handleAddRequirement}
                                                >
                                                    Add Requirement
                                                </button>
                                            </div>
                                            {showInput && (
                                                <div className="flex gap-4 mt-2">
                                                    <input
                                                        type="text"
                                                        id="requirements"
                                                        className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        value={requirementInput}
                                                        onChange={(e) => setRequirementInput(e.target.value)}
                                                        placeholder="Enter requirement"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-all ease-in-out duration-300"
                                                        onClick={handleSaveRequirement}
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            )}
                                            <ul className="list-disc list-inside mt-2 text-gray-700 space-y-2">
                                                {requirements.map((requirement, index) => (
                                                    <li key={index} className="flex justify-between items-center">
                                                        <span className="mr-4">{requirement}</span>
                                                        <button
                                                            type="button"
                                                            className="bg-red-600 text-white py-1 px-2 rounded"
                                                            onClick={() => handleRemoveRequirement(index)}
                                                        >
                                                            <FaTrashAlt />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </>
                                )}

                                {/* Conditional Fields for Courier-Based */}
                                {validationMethod === "Courier-Based" && (
                                    <>
                                        <div className="mb-4">
                                            <label
                                                className="block text-gray-700 text-sm font-medium mb-2"
                                                htmlFor="mailingAddress"
                                            >
                                                Mailing Address
                                            </label>
                                            <input
                                                type="text"
                                                id="mailingAddress"
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                value={mailingAddress}
                                                onChange={(e) => setMailingAddress(e.target.value)}
                                                placeholder="Enter mailing address"
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label
                                                className="block text-gray-700 text-sm font-medium mb-2"
                                                htmlFor="recipientName"
                                            >
                                                Recipient Name
                                            </label>
                                            <input
                                                type="text"
                                                id="recipientName"
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                value={recipientName}
                                                onChange={(e) => setRecipientName(e.target.value)}
                                                placeholder="Enter recipient name"
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label
                                                className="block text-gray-700 text-sm font-medium mb-2"
                                                htmlFor="recipientContact"
                                            >
                                                Recipient Contact
                                            </label>
                                            <input
                                                type="text"
                                                id="recipientContact"
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                value={recipientContact}
                                                onChange={(e) => setRecipientContact(e.target.value)}
                                                placeholder="Enter recipient contact"
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label
                                                className="block text-gray-700 text-sm font-medium mb-2"
                                                htmlFor="submissionDeadline"
                                            >
                                                Submission Deadline
                                            </label>
                                            <input
                                                type="date"
                                                id="submissionDeadline"
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                value={submissionDeadline}
                                                onChange={(e) => setSubmissionDeadline(e.target.value)}
                                                required
                                            />
                                        </div>
                                        {/* Requirements Section */}
                                        <div className="mb-4">
                                            <div className="flex justify-between items-center">
                                                <label
                                                    className="block text-gray-700 text-sm font-medium mb-2"
                                                    htmlFor="requirements"
                                                >
                                                    Requirements
                                                </label>
                                                <button
                                                    type="button"
                                                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-all ease-in-out duration-300"
                                                    onClick={handleAddRequirement}
                                                >
                                                    Add Requirement
                                                </button>
                                            </div>
                                            {showInput && (
                                                <div className="flex gap-4 mt-2">
                                                    <input
                                                        type="text"
                                                        id="requirements"
                                                        className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        value={requirementInput}
                                                        onChange={(e) => setRequirementInput(e.target.value)}
                                                        placeholder="Enter requirement"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-all ease-in-out duration-300"
                                                        onClick={handleSaveRequirement}
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            )}
                                            <ul className="list-disc list-inside mt-2 text-gray-700 space-y-2">
                                                {requirements.map((requirement, index) => (
                                                    <li key={index} className="flex justify-between items-center">
                                                        <span className="mr-4">{requirement}</span>
                                                        <button
                                                            type="button"
                                                            className="bg-red-600 text-white py-1 px-2 rounded"
                                                            onClick={() => handleRemoveRequirement(index)}
                                                        >
                                                            <FaTrashAlt />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </>
                                )}

                                {/* Submit Button */}
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white py-2 px-4 rounded font-bold hover:bg-blue-700 transition duration-300"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {isEditModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-2/4 relative max-h-[80vh] overflow-y-auto">
                            <button
                                className="absolute top-2 right-4 text-gray-700 hover:text-gray-900 text-2xl"
                                onClick={handleCloseModal2}
                            >
                                <FaTimes />
                            </button>
                            <h3 className="text-xl font-bold mb-4">Edit Validation</h3>
                            <form onSubmit={handleUpdate}>
                                {/* Validation Title */}
                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700 text-sm font-medium mb-2"
                                        htmlFor="validationTitle"
                                    >
                                        Validation Title
                                    </label>
                                    <input
                                        type="text"
                                        id="validationTitle"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={validationTitle}
                                        onChange={(e) => setValidationTitle(e.target.value)}
                                        placeholder="Enter validation title"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700 text-sm font-medium mb-2"
                                        htmlFor="validationDescription"
                                    >
                                        Validation Description
                                    </label>
                                    <input
                                        type="text"
                                        id="validationDescription"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={validationDescription}
                                        onChange={(e) => setValidationDescription(e.target.value)}
                                        placeholder="Enter validation description"
                                        required
                                    />
                                </div>

                                {/* Validation Method Dropdown */}
                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700 text-sm font-medium mb-2"
                                        htmlFor="validationMethod"
                                    >
                                        Validation Method
                                    </label>
                                    <select
                                        id="validationMethod"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={validationMethod}
                                        onChange={(e) => setValidationMethod(e.target.value)}
                                        required
                                    >
                                        <option value="">Select a method</option>
                                        <option value="Face-to-Face">Face-to-Face</option>
                                        <option value="Courier-Based">Courier-Based</option>
                                    </select>
                                </div>

                                {/* Conditional Fields for Face-to-Face */}
                                {validationMethod === "Face-to-Face" && (
                                    <>
                                        <div className="mb-4">
                                            <label
                                                className="block text-gray-700 text-sm font-medium mb-2"
                                                htmlFor="sessionDate"
                                            >
                                                Date & Time
                                            </label>
                                            <input
                                                type="text"
                                                id="sessionDate"
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                value={sessionDate}
                                                onChange={(e) => setSessionDate(e.target.value)}
                                                placeholder="Enter date and time"
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label
                                                className="block text-gray-700 text-sm font-medium mb-2"
                                                htmlFor="location"
                                            >
                                                Location
                                            </label>
                                            <input
                                                type="text"
                                                id="location"
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                placeholder="Enter location"
                                                required
                                            />
                                        </div>
                                        {/* Requirements Section */}
                                        <div className="mb-4">
                                            <div className="flex justify-between items-center">
                                                <label
                                                    className="block text-gray-700 text-sm font-medium mb-2"
                                                    htmlFor="requirements"
                                                >
                                                    Requirements
                                                </label>
                                                <button
                                                    type="button"
                                                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-all ease-in-out duration-300"
                                                    onClick={handleAddRequirement}
                                                >
                                                    Add Requirement
                                                </button>
                                            </div>
                                            {showInput && (
                                                <div className="flex gap-4 mt-2">
                                                    <input
                                                        type="text"
                                                        id="requirements"
                                                        className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        value={requirementInput}
                                                        onChange={(e) => setRequirementInput(e.target.value)}
                                                        placeholder="Enter requirement"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-all ease-in-out duration-300"
                                                        onClick={handleSaveRequirement}
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            )}
                                            <ul className="list-disc list-inside mt-2 text-gray-700 space-y-2">
                                                {requirements.map((requirement, index) => (
                                                    <li key={index} className="flex justify-between items-center">
                                                        {requirement}
                                                        <button
                                                            type="button"
                                                            className="bg-red-600 text-white py-1 px-2 rounded"
                                                            onClick={() => handleRemoveRequirement(index)}
                                                        >
                                                            <FaTrashAlt />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </>
                                )}

                                {/* Conditional Fields for Courier-Based */}
                                {validationMethod === "Courier-Based" && (
                                    <>
                                        <div className="mb-4">
                                            <label
                                                className="block text-gray-700 text-sm font-medium mb-2"
                                                htmlFor="mailingAddress"
                                            >
                                                Mailing Address
                                            </label>
                                            <input
                                                type="text"
                                                id="mailingAddress"
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                value={mailingAddress}
                                                onChange={(e) => setMailingAddress(e.target.value)}
                                                placeholder="Enter mailing address"
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label
                                                className="block text-gray-700 text-sm font-medium mb-2"
                                                htmlFor="recipientName"
                                            >
                                                Recipient Name
                                            </label>
                                            <input
                                                type="text"
                                                id="recipientName"
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                value={recipientName}
                                                onChange={(e) => setRecipientName(e.target.value)}
                                                placeholder="Enter recipient name"
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label
                                                className="block text-gray-700 text-sm font-medium mb-2"
                                                htmlFor="recipientContact"
                                            >
                                                Recipient Contact
                                            </label>
                                            <input
                                                type="text"
                                                id="recipientContact"
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                value={recipientContact}
                                                onChange={(e) => setRecipientContact(e.target.value)}
                                                placeholder="Enter recipient contact"
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label
                                                className="block text-gray-700 text-sm font-medium mb-2"
                                                htmlFor="submissionDeadline"
                                            >
                                                Submission Deadline
                                            </label>
                                            <input
                                                type="date"
                                                id="submissionDeadline"
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                value={submissionDeadline}
                                                onChange={(e) => setSubmissionDeadline(e.target.value)}
                                                required
                                            />
                                        </div>
                                        {/* Requirements Section */}
                                        <div className="mb-4">
                                            <div className="flex justify-between items-center">
                                                <label
                                                    className="block text-gray-700 text-sm font-medium mb-2"
                                                    htmlFor="requirements"
                                                >
                                                    Requirements
                                                </label>
                                                <button
                                                    type="button"
                                                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-all ease-in-out duration-300"
                                                    onClick={handleAddRequirement}
                                                >
                                                    Add Requirement
                                                </button>
                                            </div>
                                            {showInput && (
                                                <div className="flex gap-4 mt-2">
                                                    <input
                                                        type="text"
                                                        id="requirements"
                                                        className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        value={requirementInput}
                                                        onChange={(e) => setRequirementInput(e.target.value)}
                                                        placeholder="Enter requirement"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-all ease-in-out duration-300"
                                                        onClick={handleSaveRequirement}
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            )}
                                            <ul className="list-disc list-inside mt-2 text-gray-700 space-y-2">
                                                {requirements.map((requirement, index) => (
                                                    <li key={index} className="flex justify-between items-center">
                                                        {requirement}
                                                        <button
                                                            type="button"
                                                            className="bg-red-600 text-white py-1 px-2 rounded"
                                                            onClick={() => handleRemoveRequirement(index)}
                                                        >
                                                            <FaTrashAlt />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </>
                                )}

                                {/* Submit Button */}
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white py-2 px-4 rounded font-bold hover:bg-blue-700 transition duration-300"
                                    >
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}