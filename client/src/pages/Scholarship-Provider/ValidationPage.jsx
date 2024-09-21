import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ProviderHeaderSidebar from '../../components/ProviderHeaderAndSidebar';
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FaCheckCircle, FaPaperPlane, FaTrashAlt } from "react-icons/fa";
import { MdPending } from "react-icons/md";
import { FaClock } from "react-icons/fa6";
import Modal from 'react-modal';
import { useNavigate } from "react-router-dom";

Modal.setAppElement('#root'); // Set the app element for accessibility

export default function ValidationPage() {
    const currentUser = useSelector((state) => state.user.currentUser);
    const providerId = currentUser._id;
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [validations, setValidations] = useState([]);
    const [selectedValidation, setSelectedValidation] = useState(localStorage.getItem('selectedValidation') || null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [modalResultId, setModalResultId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [feedback, setFeedback] = useState(""); // State for feedback input

    const fetchValidations = async () => {
        try {
            const response = await fetch(`/api/validation/provider/${providerId}/validations`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (Array.isArray(data)) {
                setValidations(data);
                if (data.length > 0 && !selectedValidation) {
                    setSelectedValidation(data[0]._id);
                    localStorage.setItem('selectedValidation', data[0]._id);
                }
            } else {
                console.error("Fetched data is not an array:", data);
            }
        } catch (error) {
            console.error("Error fetching validations:", error);
        }
    };

    useEffect(() => {
        fetchValidations();
    }, [providerId]);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const handleValidationClick = (validationId) => {
        setSelectedValidation(validationId);
        localStorage.setItem('selectedValidation', validationId);
    };

    const openModal = (action, resultId) => {
        setModalAction(action);
        setModalResultId(resultId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalAction(null);
        setModalResultId(null);
    };

    const handleConfirmAction = async () => {
        console.log(`${modalAction} action confirmed for result ID: ${modalResultId}`);

        const endpoint = `/api/validation/${selectedValidation}/result/${modalResultId}/${modalAction.toLowerCase()}`;
        const body = {
            feedback: modalAction === 'Reject' ? feedback : null // Include feedback only for rejection
        };

        try {
            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body), // Send feedback
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data.message);

            // Refetch validations to update the table
            await fetchValidations();
        } catch (error) {
            console.error('Error updating validation result:', error);
        }

        closeModal();
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    console.log(selectedValidation);

    const filteredValidations = validations.filter(
        (validation) => validation._id === selectedValidation
    );

    const filteredResults = filteredValidations.flatMap(validation =>
        validation.validationResults.filter(result =>
            `${result.scholar.applicantDetails.firstName} ${result.scholar.applicantDetails.lastName}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        )
    );

    const selectedValidationTitle = validations.find(
        (validation) => validation._id === selectedValidation
    )?.validationTitle;

    return (
        <div className="flex flex-col min-h-screen">
            <main className={`flex-grow bg-[#f8f8fb] transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : ''}`}>
                <ProviderHeaderSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

                <div className="max-w-8xl mx-24 mt-6">
                    <span>
                        <h1 className="text-3xl font-bold mb-4">Validation</h1>
                    </span>

                    <div className="flex gap-10">
                        <div className="flex flex-col items-center w-1/4 bg-white border shadow px-4 py-6 rounded-md">
                            <span className="bg-blue-500 w-full px-8 py-2 text-center rounded-md text-white font-medium">Your Scholarships</span>

                            <div className="mt-4 w-full h-96 overflow-y-auto">
                                {validations.map((validation) => (
                                    <div
                                        key={validation._id}
                                        className={`flex justify-between bg-slate-200 p-2 my-1 rounded-md cursor-pointer`}
                                        onClick={() => handleValidationClick(validation._id)} // Changed here
                                    >
                                        <div className="flex gap-1 items-center">
                                            <img
                                                src={validation.scholarshipProgram.scholarshipImage}
                                                alt={validation.validationTitle}
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <h3 className="text-sm font-medium">{validation.validationTitle}</h3>
                                        </div>
                                        <div className="flex items-center">
                                            <span className={`p-1 rounded-full text-white flex items-center gap-1 
                                                ${validation.status === 'Pending' ? 'bg-yellow-500'
                                                    : validation.status === 'Upcoming' ? 'bg-blue-500'
                                                        : validation.status === 'Ongoing' ? 'bg-orange-500'
                                                            : validation.status === 'Done' ? 'bg-green-500'
                                                                : validation.status === 'Deleted' ? 'bg-red-500'
                                                                    : 'bg-gray-500'}`}>
                                                {validation.status === 'Pending' && <FaClock className="w-4 h-4" />}
                                                {validation.status === 'Upcoming' && <MdPending className="w-4 h-4" />}
                                                {validation.status === 'Ongoing' && <FaClock className="w-4 h-4" />}
                                                {validation.status === 'Done' && <FaCheckCircle className="w-4 h-4" />}
                                                {validation.status === 'Deleted' && <FaTrashAlt className="w-4 h-4" />}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 w-full">
                            <div className="flex gap-4 items-center">
                                {selectedValidationTitle && (
                                    <h2 className="text-xl font-semibold">{selectedValidationTitle}</h2>
                                )}
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="border rounded-md p-2 px-4 ml-auto"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </div>
                            <div className="w-full h-full">
                                <div className="flex flex-col justify-between h-full border rounded-md bg-white w-full">
                                    <table className="min-w-full divide-y border-b divide-gray-200 text">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Scholar</th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Mark as</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredResults.map((result) => (
                                                <tr key={result._id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <div className="flex items-center justify-center">
                                                            <img
                                                                src={result.scholar.profilePicture}
                                                                alt={`${result.scholar.applicantDetails.firstName} ${result.scholar.applicantDetails.lastName}`}
                                                                className="w-8 h-8 rounded-full mr-2"
                                                            />
                                                            <span>{`${result.scholar.applicantDetails.firstName} ${result.scholar.applicantDetails.lastName}`}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <div className="flex items-center justify-center">
                                                            <div className={`w-4 h-4 rounded-full inline-block
                                                                ${result.status === 'Pending' ? 'bg-yellow-500'
                                                                    : result.status === 'Approved' ? 'bg-green-500'
                                                                        : 'bg-red-500'}`}>
                                                            </div>
                                                            <span className="ml-2">{result.status}</span>
                                                        </div>
                                                    </td>
                                                    <td className="flex gap-2 px-6 py-4 whitespace-nowrap justify-center">
                                                        {result.status === 'Pending' ? (
                                                            <>
                                                                <button
                                                                    className="bg-green-600 text-white px-4 py-1 rounded-full hover:bg-green-900"
                                                                    onClick={() => openModal('Approve', result._id)}
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    className="bg-red-600 text-white px-4 py-1 rounded-full hover:bg-red-900"
                                                                    onClick={() => openModal('Reject', result._id)}
                                                                >
                                                                    Reject
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <span className="text-gray-500">
                                                                {result.status === 'Approved' ? 'Approved' : 'Rejected'}
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => navigate(`/validation/${selectedValidation}/scholars`)} // Navigate to validation result
                                    className='bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-800'
                                >
                                    Mark as Done
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    className="fixed inset-0 flex items-center justify-center z-50"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
                >
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900">
                            {modalAction} Validation Result
                        </h2>
                        <p className="text-gray-600">Are you sure you want to {modalAction} this validation result?</p>
                        {modalAction === 'Reject' && (
                            <div className="mt-4">
                                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                                    Feedback <span className="text-gray-500">(optional):</span>
                                </label>
                                <textarea
                                    id="feedback"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    rows="4"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Provide feedback on the rejection here..."
                                />
                            </div>
                        )}
                        <div className="mt-6 flex justify-end space-x-2">
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md transition duration-150 ease-in-out"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-150 ease-in-out"
                                onClick={handleConfirmAction}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </Modal>

            </main>
        </div>
    );
}
