import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Validation() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [validations, setValidations] = useState([]);
    const [requirements, setRequirements] = useState([]);
    const [requirementInput, setRequirementInput] = useState('');
    const [validationTitle, setValidationTitle] = useState('');
    const [validationDescription, setValidationDescription] = useState('');
    const [editingValidationId, setEditingValidationId] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const { id } = useParams();
    const scholarshiProgramId = id;

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
    };

    const handleCloseModal2 = () => {
        setIsEditModalOpen(false);
        setRequirements([]); // Clear requirements when modal is closed
        setRequirementInput(''); // Optionally clear the input field as well
        setValidationTitle(''); // Optionally clear the title field as well
        setValidationDescription(''); // Optionally clear the description field as well
    };

    const handleAddRequirement = () => {
        if (requirementInput.trim()) {
            setRequirements([...requirements, requirementInput.trim()]);
            setRequirementInput('');
        }
    };

    const handleRemoveRequirement = (index) => {
        setRequirements(requirements.filter((_, i) => i !== index));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            id: scholarshiProgramId,
            validationTitle,
            validationDescription,
            requirements
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
            setEditingValidationId(validationId);
            setIsEditModalOpen(true);
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();

        const updatedValidation = {
            validationTitle,
            validationDescription,
            requirements: requirements.map(req => ({ requirement: req }))
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
            } else {
                console.error('Failed to update validation status');
            }
        } catch (error) {
            console.error('Error updating validation status:', error);
        }
    };

    const pendingValidations = validations.filter(validation => validation.status === 'Pending');
    const ongoingValidations = validations.filter(validation => validation.status === 'Ongoing');
    const doneValidations = validations.filter(validation => validation.status === 'Done');

    return (
        <>
            <div className="p-6 bg-white rounded-lg shadow-md ">
                <div className='flex justify-between items-center'>
                    <h2 className="text-2xl font-bold mb-4 text-blue-600">Validation</h2>
                    <div>
                        <button
                            className="bg-blue-600 text-white py-2 px-4 rounded"
                            onClick={handleButtonClick}
                        >
                            Create Validation
                        </button>
                    </div>
                </div>

                {/* Upcoming Document Validation Content */}
                <h3 className='text-xl font-bold tracking-wide mt-4'>Pending Document Validation</h3>

                <div className="p-6">
                    {pendingValidations.length === 0 ? (
                            <p className='bg-slate-200 text-slate-600 px-8 py-4 rounded-md text-left'>No pending document validations at the moment.</p>
                    ) : (
                        pendingValidations.map((validation) => (
                            <div key={validation._id} className='bg-white border-l-4 border-l-blue-500 text-black-700 p-4 rounded-md border shadow relative mb-6'>
                                <div className='flex justify-between items-center mb-4'>
                                    <h3 className='text-lg font-medium'>{validation.validationTitle}</h3>
                                    <span className={`inline-block px-3 py-1 rounded-full text-white ${validation.status === 'posted' ? 'bg-green-600' : 'bg-blue-600'}`}>
                                        Status: {validation.status}
                                    </span>
                                </div>
                                <p className='mb-4'>{validation.validationDescription}</p>
                                <ul className='list-disc pl-5'>
                                    {validation.requirements.map((req, index) => (
                                        <li key={index} className='mb-2'>
                                            {req.requirement}
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex justify-between items-end mt-4">
                                    <div className="flex space-x-4">
                                        <button
                                            className="bg-green-600 text-white py-2 px-4 rounded"
                                            onClick={() => handlePostValidation(validation._id)}
                                        >
                                            Post Validation
                                        </button>
                                        <button
                                            className="bg-yellow-600 text-white py-2 px-4 rounded"
                                            onClick={() => handleEditValidation(validation._id)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-600 text-white py-2 px-4 rounded"
                                            onClick={() => handleDeleteValidation(validation._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <div className='text-right'>
                                        <p className='text-gray-600'>Date Created: {new Date(validation.dateCreated).toLocaleDateString()}</p>
                                        {validation.datePosted && (
                                            <p className='text-gray-600'>Date Posted: {new Date(validation.datePosted).toLocaleDateString()}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Ongoing Document Validation Content */}
                <h3 className='text-xl font-bold mt-4'>Ongoing Document Validation</h3>
                <div className="p-6">
                    {ongoingValidations.length === 0 ? (
                        <p className='bg-slate-200 text-slate-600 px-8 py-4 rounded-md text-left'>No ongoing document validations at the moment.</p>
                    ) : (
                        ongoingValidations.map((validation) => (
                            <div key={validation._id} className='bg-white border-l-4 border-l-blue-500 text-black-700 p-4 rounded-md border shadow relative mb-6'>
                                <div className='flex justify-between items-center mb-4'>
                                    <h3 className='text-xl font-bold'>{validation.validationTitle}</h3>
                                    <span className={`inline-block px-3 py-1 rounded-full text-white ${validation.status === 'posted' ? 'bg-green-600' : 'bg-blue-600'}`}>
                                        Status: {validation.status}
                                    </span>
                                </div>
                                <p className='mb-4'>{validation.validationDescription}</p>
                                <ul className='list-disc pl-5'>
                                    {validation.requirements.map((req, index) => (
                                        <li key={index} className='mb-2'>
                                            {req.requirement}
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex justify-between items-end mt-4">
                                    <div className="flex space-x-4">
                                        <button
                                            className="bg-yellow-600 text-white py-2 px-4 rounded"
                                            onClick={() => handleEditValidation(validation._id)}
                                        >
                                            Edit
                                        </button>
                                        {validation.status === 'Ongoing' && (
                                            <button
                                                className="bg-red-600 text-white py-2 px-4 rounded"
                                                onClick={() => handleMarkAsDone(validation._id)}
                                            >
                                                Mark as Done
                                            </button>
                                        )}
                                    </div>
                                    <div className='text-right'>
                                        <p className='text-gray-600'>Date Created: {new Date(validation.dateCreated).toLocaleDateString()}</p>
                                        {validation.datePosted && (
                                            <p className='text-gray-600'>Date Posted: {new Date(validation.datePosted).toLocaleDateString()}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Previous Document Validation Content */}
                <h3 className='text-xl font-bold mt-4'>Previous Document Validation</h3>
                <div className="p-6">
                    {doneValidations.length === 0 ? (
                        <p className='bg-slate-200 text-slate-600 px-8 py-4 rounded-md text-left'>No previous document validations at the moment.</p>
                    ) : (
                        doneValidations.map((validation) => (
                            <div key={validation._id} className='bg-white border-l-4 border-l-blue-500 text-black-700 p-4 rounded-md border shadow relative mb-6'>
                                <div className='flex justify-between items-center mb-4'>
                                    <h3 className='text-xl font-bold'>{validation.validationTitle}</h3>
                                    <span className={`inline-block px-3 py-1 rounded-full text-white ${validation.status === 'posted' ? 'bg-green-600' : 'bg-blue-600'}`}>
                                        Status: {validation.status}
                                    </span>
                                </div>
                                <p className='mb-4'>{validation.validationDescription}</p>
                                <ul className='list-disc pl-5'>
                                    {validation.requirements.map((req, index) => (
                                        <li key={index} className='mb-2'>
                                            {req.requirement}
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex justify-between items-end mt-4">
                                    <div className="flex space-x-4">
                                        {/* No actions for previous validations */}
                                    </div>
                                    <div className='text-right'>
                                        <p className='text-gray-600'>Date Created: {new Date(validation.dateCreated).toLocaleDateString()}</p>
                                        {validation.datePosted && (
                                            <p className='text-gray-600'>Date Posted: {new Date(validation.datePosted).toLocaleDateString()}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative">
                            <button
                                className="absolute top-2 right-4 text-gray-700 hover:text-gray-900 text-2xl"
                                onClick={handleCloseModal}
                            >
                                &times;
                            </button>
                            <h3 className="text-xl font-bold mb-4">Post Validation</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="validationTitle">
                                        Validation Title
                                    </label>
                                    <input
                                        type="text"
                                        id="validationTitle"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={validationTitle}
                                        onChange={(e) => setValidationTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="validationDescription">
                                        Validation Description
                                    </label>
                                    <textarea
                                        id="validationDescription"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={validationDescription}
                                        onChange={(e) => setValidationDescription(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="requirements">
                                        Requirements
                                    </label>
                                    <div className="flex flex-col gap-4">
                                        <input
                                            type="text"
                                            id="requirements"
                                            className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            value={requirementInput}
                                            onChange={(e) => setRequirementInput(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="bg-blue-600 text-whit py-2 w-[180px] text-center px-4 rounded text-white hover:w-full hover:font-bold hover:bg-blue-700 transition-all ease-in-out duration-300"
                                            onClick={handleAddRequirement}
                                        >
                                            Add Requirement
                                        </button>
                                    </div>
                                    <ul className="list-disc list-inside mt-2 text-gray-700">
                                        {requirements.map((requirement, index) => (
                                            <li key={index} className="flex justify-between items-center">
                                                {requirement}
                                                <button
                                                    type="button"
                                                    className="bg-red-600 text-white py-1 px-2 rounded ml-2"
                                                    onClick={() => handleRemoveRequirement(index)}
                                                >
                                                    Remove
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white py-2 px-4 rounded font-bold"
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
                        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative">
                            <button
                                className="absolute top-2 right-4 text-gray-700 hover:text-gray-900 text-2xl"
                                onClick={handleCloseModal2}
                            >
                                &times;
                            </button>
                            <h3 className="text-xl font-bold mb-4">Edit Validation</h3>
                            <form onSubmit={handleUpdate}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="validationTitle">
                                        Validation Title
                                    </label>
                                    <input
                                        type="text"
                                        id="validationTitle"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={validationTitle}
                                        onChange={(e) => setValidationTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="validationDescription">
                                        Validation Description
                                    </label>
                                    <textarea
                                        id="validationDescription"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={validationDescription}
                                        onChange={(e) => setValidationDescription(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="requirements">
                                        Requirements
                                    </label>
                                    <div className="flex flex-col gap-4">
                                        <input
                                            type="text"
                                            id="requirements"
                                            className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            value={requirementInput}
                                            onChange={(e) => setRequirementInput(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                             className="bg-blue-600 text-whit py-2 w-[180px] text-center px-4 rounded text-white hover:w-full hover:font-bold hover:bg-blue-700 transition-all ease-in-out duration-300"
                                            onClick={handleAddRequirement}
                                        >
                                            Add Requirement
                                        </button>
                                    </div>
                                    <ul className="list-disc list-inside mt-2 text-gray-700">
                                        {requirements.map((requirement, index) => (
                                            <li key={index} className="flex justify-between items-center">
                                                {requirement}
                                                <button
                                                    type="button"
                                                    className="bg-red-600 text-white py-1 px-2 rounded ml-2"
                                                    onClick={() => handleRemoveRequirement(index)}
                                                >
                                                    Remove
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white py-2 px-4 font-medium rounded"
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