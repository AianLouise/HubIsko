import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import { BiFilter } from "react-icons/bi";
import Layout from "../../components/Layout";
import { FaGoogleScholar } from "react-icons/fa6";
import axios from "axios";
import { FaFileAlt } from "react-icons/fa";

export default function ScholarshipProgramApplications() {
    useEffect(() => {
        document.title = "Scholarship Program Applications | HubIsko";
    }, []);
    const [programs, setPrograms] = useState([]);

    const fetchPendingApprovalPrograms = async () => {
        try {
            const response = await fetch("/api/admin/search-pending-approval-programs");
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setPrograms(data);
        } catch (error) {
            console.error("Error fetching pending approval programs:", error);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchPendingApprovalPrograms();
    }, []);

    return (
        <div className="flex flex-col min-h-screen font-medium text-slate-700">

            <main className="flex-grow bg-[#f8f8fb]">
                <div className="border-b mb-8">
                    <div className="flex items-center justify-between px-6 lg:px-24 mx-auto">
                        <div className="flex flex-col gap-2 w-full lg:w-1/2">
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
                                Scholarship Program Applications
                            </h1>
                            <p className="text-lg text-gray-600">
                                Review and manage scholarship program applications from scholarship providers.
                            </p>
                        </div>
                        <div className="bg-slate-200 border-2 border-blue-600 text-black w-44 h-44 lg:w-72 lg:h-44 my-8 p-2 rounded-md flex">
                            <div className="flex flex-col justify-between text-left lg:flex-row">
                                <div className="flex flex-col justify-between p-4">
                                    <h2 className="text-sm lg:text-xl font-semibold tracking-wide">
                                        Pending Applications
                                    </h2>
                                    <span className="text-xl lg:text-4xl text-blue-600 font-bold">
                                        {programs.length}
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
                        <h1 className="text-xl font-semibold border-b pb-4">Scholarship Programs</h1>
                        <div className="flex gap-4 mt-5">
                            <input
                                type="text"
                                placeholder="Search for a scholarship"
                                className="border rounded-md p-2 flex-grow"
                            />
                            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-800 text-white p-2 rounded-md">
                                <BiFilter className="w-6 h-6" />
                                <span>Filter</span>
                            </button>
                        </div>

                        <table className="w-full mt-4 border border-gray-200 bg-white rounded-lg">
                            <thead className="bg-slate-100 rounded-t-lg">
                                <tr>
                                    <th className="border border-gray-200 p-2">Scholarship Program Name</th>
                                    <th className="border border-gray-200 p-2">Organization</th>
                                    <th className="border border-gray-200 p-2">Email</th>
                                    <th className="border border-gray-200 p-2">Status</th>
                                    <th className="border border-gray-200 p-2">Details</th>
                                </tr>
                            </thead>
                            <tbody className="text-center rounded-b-lg">
                                {programs.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-4">
                                            <div className="flex justify-center items-center h-32">
                                                <span className="text-xl font-semibold">No scholarship program application found.</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    programs.map((program) => (
                                        <tr key={program._id} className="divide-x hover:bg-gray-100">
                                            <td className="p-2">{program.title}</td>
                                            <td className="p-2">{program.organizationName}</td>
                                            <td className="p-2">{program.contactEmail}</td>
                                            <td className="p-2 text-yellow-500">{program.status}</td>
                                            <td className="p-4">
                                                <Link
                                                    to={`/scholarship-program-applications/${program._id}`}
                                                    className="bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded-md text-white"
                                                >
                                                    View Details
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