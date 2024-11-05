import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import { BiFilter } from "react-icons/bi";
import Layout from "../../components/Layout";
import { FaFileAlt } from "react-icons/fa";

const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
        case 'pending verification':
            return 'bg-yellow-500';
        case 'verified':
            return 'bg-green-600';
        case 'rejected':
            return 'bg-red-500';
        default:
            return 'bg-gray-500';
    }
};

const toSentenceCase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export default function StudentApplications() {
    useEffect(() => {
        document.title = "Student Applications | HubIsko";
    }, []);

    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [sortOrder, setSortOrder] = useState('recent');

    const fetchPendingApprovalStudents = async () => {
        try {
            const response = await fetch("/api/adminApp/search-pending-verification-students");
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setStudents(data);
            setFilteredStudents(data); // Initialize filteredStudents with all data
        } catch (error) {
            console.error("Error fetching pending approval students:", error);
        }
    };

    useEffect(() => {
        fetchPendingApprovalStudents();
    }, []);

    const handleSort = (order) => {
        setSortOrder(order);
    };

    useEffect(() => {
        // Filter students based on search query
        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = students.filter(student =>
        (student.applicantDetails.firstName.toLowerCase().includes(lowercasedQuery) ||
            student.applicantDetails.lastName.toLowerCase().includes(lowercasedQuery) ||
            student.email.toLowerCase().includes(lowercasedQuery))
        );

        // Sort filtered students based on sortOrder
        const sorted = filtered.sort((a, b) => {
            if (sortOrder === 'oldest') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else {
                return new Date(a.createdAt) - new Date(b.createdAt);
            }
        });

        setFilteredStudents(sorted);
    }, [searchQuery, students, sortOrder]);

    return (
        <div className="flex flex-col min-h-screen font-medium text-slate-700">
            <main className="flex-grow bg-[#f8f8fb]">
                <div className="border-b mb-8">
                    <div className="flex items-center justify-between px-6 lg:px-24 mx-auto">
                        <div className="flex flex-col gap-2 w-full lg:w-1/2">
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
                                Student Applications
                            </h1>
                            <p className="text-lg text-gray-600">
                                Review and manage student applications.
                            </p>
                        </div>
                        <div className="bg-slate-200 border-2 border-blue-600 text-black w-44 h-44 lg:w-72 lg:h-44 my-8 p-2 rounded-md flex">
                            <div className="flex flex-col justify-between text-left lg:flex-row">
                                <div className="flex flex-col justify-between p-4">
                                    <h2 className="text-sm lg:text-xl font-semibold tracking-wide">
                                        Pending Applications
                                    </h2>
                                    <span className="text-xl lg:text-4xl text-blue-600 font-bold">
                                        {students.length}
                                    </span>
                                    <p className="text-base text-slate-500">
                                        Applications awaiting review
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-8xl mx-auto px-6 lg:px-24 flex flex-col gap-10">


                    <div className="flex flex-col gap-4 h-screen pt-5">
                        <h1 className="text-xl font-semibold border-b pb-4">Student Applications</h1>
                        <div className="flex gap-4 mt-5">
                            <input
                                type="text"
                                placeholder="Search for a student"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border rounded-md p-2 flex-grow"
                            />
                            <button
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-800 text-white p-2 rounded-md"
                                onClick={() => handleSort(sortOrder === 'recent' ? 'oldest' : 'recent')}
                            >
                                <BiFilter className="w-6 h-6" />
                                <span>{sortOrder === 'recent' ? 'Oldest' : 'Recent'}</span>
                            </button>
                        </div>

                                                <table className="w-full mt-4 border border-gray-200 bg-white rounded-lg shadow-md">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="border border-gray-200 p-2 text-left">Student Name</th>
                                    <th className="border border-gray-200 p-2 text-center">Email</th>
                                    <th className="border border-gray-200 p-2 text-center">Contact Number</th>
                                    <th className="border border-gray-200 p-2 text-center">Status</th>
                                    <th className="border border-gray-200 p-2 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-4">
                                            <div className="flex justify-center items-center h-32">
                                                <span className="text-xl font-semibold">No student application found.</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student) => (
                                        <tr key={student._id} className="hover:bg-gray-100">
                                            <td className="p-2 text-left">
                                                <div className="flex gap-2 items-center">
                                                    <img src={student.profilePicture} alt="Profile" className="rounded-full h-6 w-6 object-cover" />
                                                    {student.applicantDetails.firstName} {student.applicantDetails.lastName}
                                                </div>
                                            </td>
                                            <td className="p-2 text-center">{student.email}</td>
                                            <td className="p-2 text-center">{student.applicantDetails.contactNumber}</td>
                                            <td className="p-4 text-center">
                                                <span className={`inline-block w-3 h-3 mr-2 rounded-full ${getStatusColor(student.status)}`}></span>
                                                {toSentenceCase(student.status)}
                                            </td>
                                            <td className="p-4 text-center">
                                                <Link
                                                    to={`/student-applications/${student._id}`}
                                                    className="bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded-md text-white"
                                                >
                                                    Verify
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <div className="mt-8"></div> {/* Added space after the table */}
                    </div>
                </div>
            </main>
        </div>
    );
}