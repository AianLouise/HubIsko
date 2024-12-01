import React, { useState } from "react";
import { FaFileAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from "react-redux";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../../assets/NewLogo.png';
import { FaUser, FaCheckCircle, FaClock, FaCheck, FaUserGraduate, FaUserTie, FaUserShield } from 'react-icons/fa';

export default function AdminSettings() {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [selectedTab, setSelectedTab] = useState('Update Information');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [role, setRole] = useState('');
    const [program, setProgram] = useState('');
    const [status, setStatus] = useState('');
    const [accountReportGenerated, setAccountReportGenerated] = useState(false);
    const [programReportGenerated, setProgramReportGenerated] = useState(false);
    const [accountLoading, setAccountLoading] = useState(false);
    const [programLoading, setProgramLoading] = useState(false);
    const [accountReportData, setAccountReportData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleTabClick = (tab) => setSelectedTab(tab);

    const fetchAccountReportData = async () => {
        try {
            const response = await fetch('/api/admin/account-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    startDate,
                    endDate,
                    role,
                }),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching account report data:', error);
            return null;
        }
    };

    const handleGenerateAccountReport = async () => {
        if ((startDate && !endDate) || (!startDate && endDate)) {
            setErrorMessage('Please provide both start date and end date.');
            return;
        }
    
        if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
            setErrorMessage('End date cannot be earlier than start date.');
            return;
        }
    
        setErrorMessage('');
        setAccountLoading(true);
        const data = await fetchAccountReportData();
        if (data) {
            setAccountReportData(data);
            setAccountReportGenerated(true);
        }
        setAccountLoading(false);
    };

    const handleGenerateProgramReport = () => {
        setProgramLoading(true);
        // Logic to generate the program report based on the conditions
        setTimeout(() => {
            setProgramReportGenerated(true);
            setProgramLoading(false);
        }, 2000); // Simulate a delay for generating the report
    };

    const generateAccountPDF = async () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const logoBase64 = await loadImageToBase64(logo); // Convert logo to base64

        // Define the variables for the overview section
        const totalUsers = accountReportData ? accountReportData.length : 0;
        const verifyAccountCount = accountReportData ? accountReportData.filter(user => user.status === 'Verify Account').length : 0;
        const pendingVerificationCount = accountReportData ? accountReportData.filter(user => user.status === 'Pending Verification').length : 0;
        const verifiedCount = accountReportData ? accountReportData.filter(user => user.status === 'Verified').length : 0;
        const totalApplicants = accountReportData ? accountReportData.filter(user => user.role === 'applicant').length : 0;
        const totalScholarshipProviders = accountReportData ? accountReportData.filter(user => user.role === 'scholarship_provider').length : 0;
        const totalAdmins = accountReportData ? accountReportData.filter(user => user.role === 'admin').length : 0;

        // Log the report data to the console
        console.log("Account Report Data:", accountReportData);

        // Add logo and header
        const pageWidth = pdf.internal.pageSize.getWidth();
        const logoWidth = 10;
        const logoHeight = 10;
        const title = "HubIsko Account Report";
        const titleWidth = pdf.getTextWidth(title);
        const totalWidth = logoWidth + titleWidth + 5; // 5 is the space between logo and title
        const startX = (pageWidth - totalWidth) / 2;

        pdf.addImage(logoBase64, 'PNG', startX, 10, logoWidth, logoHeight); // Add logo with size 10x10
        pdf.setFontSize(16); // Slightly larger font size for title
        pdf.text(title, startX + logoWidth + 5, 18); // Position title next to the logo
        pdf.setFontSize(12); // Reduced font size for description and other text
        pdf.text("This report contains detailed information about account informations.", 25.4, 30); // 1 inch margin
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        pdf.text(`Generated on: ${new Date().toLocaleString('en-US', options)}`, 25.4, 40); // 1 inch margin
        if (startDate) {
            pdf.text(`Start Date: ${startDate}`, 25.4, 50); // 1 inch margin
        }

        if (endDate) {
            pdf.text(`End Date: ${endDate}`, 25.4, 60); // 1 inch margin
        }
        if (role) {
            pdf.text(`Role: ${role}`, 25.4, 70); // 1 inch margin
        }

        // Add overview section
        pdf.setFontSize(12); // Slightly larger font size for overview header
        pdf.setFont("helvetica", "bold");
        pdf.text("Overview:", 25.4, 80); // 1 inch margin
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(12); // Reduced font size for overview details
        pdf.text(`Total Users: ${totalUsers}`, 25.4, 90); // 1 inch margin
        pdf.text(`Verify Account: ${verifyAccountCount}`, 25.4, 100); // 1 inch margin
        pdf.text(`Pending Verification: ${pendingVerificationCount}`, 25.4, 110); // 1 inch margin
        pdf.text(`Verified: ${verifiedCount}`, 25.4, 120); // 1 inch margin
        pdf.text(`Total Applicants: ${totalApplicants}`, 25.4, 130); // 1 inch margin
        pdf.text(`Total Scholarship Providers: ${totalScholarshipProviders}`, 25.4, 140); // 1 inch margin
        pdf.text(`Total Admins: ${totalAdmins}`, 25.4, 150); // 1 inch margin

        // Add a new page for the account report data
        pdf.addPage();

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12); // Slightly larger font size for section header
        pdf.text("Account Report Data:", 25.4, 25.4); // 1 inch margin
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(12); // Increased font size for report data

        let y = 35.4; // 1 inch margin + 10mm

        const addDetails = (details, indent = 0, skipNested = false) => {
            Object.keys(details).forEach(key => {
                const value = details[key];
                if (typeof value === 'object' && value !== null) {
                    if (!skipNested) {
                        pdf.setFont("helvetica", "bold");
                        pdf.text(`${' '.repeat(indent)}${key}:`, 25.4, y);
                        pdf.setFont("helvetica", "normal");
                        y += 10;
                        addDetails(value, indent + 2);
                    }
                } else {
                    const text = `${' '.repeat(indent)}${key}: ${value}`;
                    const lines = pdf.splitTextToSize(text, 160); // Split text to fit within 160mm width (210mm - 2 inch margin)
                    lines.forEach(line => {
                        if (y > 270) {
                            pdf.addPage();
                            y = 25.4;
                        }
                        pdf.text(line, 25.4, y); // 1 inch margin
                        y += 10;
                    });
                }
            });
        };

        accountReportData.forEach((item, index) => {
            if (y > 270) { // Check if we need to add a new page (297mm - 1 inch margin)
                pdf.addPage();
                y = 25.4; // Reset y coordinate for new page with 1 inch margin
            }
            pdf.text(`Record ${index + 1}:`, 25.4, y); // 1 inch margin
            y += 10;
            addDetails(item, 0, true); // Skip nested objects

            // Add details for admin, applicant, and scholarship provider
            if (item.adminDetails) {
                pdf.setFont("helvetica", "bold");
                pdf.text("Admin Details:", 25.4, y);
                pdf.setFont("helvetica", "normal");
                y += 10;
                addDetails(item.adminDetails, 2);
            }

            if (item.applicantDetails) {
                pdf.setFont("helvetica", "bold");
                pdf.text("Applicant Details:", 25.4, y);
                pdf.setFont("helvetica", "normal");
                y += 10;
                addDetails(item.applicantDetails, 2);
            }

            if (item.scholarshipProviderDetails) {
                pdf.setFont("helvetica", "bold");
                pdf.text("Scholarship Provider Details:", 25.4, y);
                pdf.setFont("helvetica", "normal");
                y += 10;
                addDetails(item.scholarshipProviderDetails, 2);
            }

            y += 10; // Add extra space between records
        });

        pdf.save("account_report.pdf");
    };

    const generateProgramPDF = async () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const logoBase64 = await loadImageToBase64(logo); // Convert logo to base64

        // Define the variables for the overview section
        const totalPrograms = accountReportData ? accountReportData.length : 0;
        const totalActivePrograms = accountReportData ? accountReportData.filter(program => program.status === 'active').length : 0;
        const totalInactivePrograms = accountReportData ? accountReportData.filter(program => program.status === 'inactive').length : 0;

        // Log the report data to the console
        console.log("Program Report Data:", accountReportData);

        // Add logo and header
        const pageWidth = pdf.internal.pageSize.getWidth();
        const logoWidth = 10;
        const logoHeight = 10;
        const title = "HubIsko Program Report";
        const titleWidth = pdf.getTextWidth(title);
        const totalWidth = logoWidth + titleWidth + 5; // 5 is the space between logo and title
        const startX = (pageWidth - totalWidth) / 2;

        pdf.addImage(logoBase64, 'PNG', startX, 10, logoWidth, logoHeight); // Add logo with size 10x10
        pdf.setFontSize(16); // Slightly larger font size for title
        pdf.text(title, startX + logoWidth + 5, 18); // Position title next to the logo
        pdf.setFontSize(10); // Reduced font size for description and other text
        pdf.text("This report contains detailed information about program activities and statuses.", 25.4, 30); // 1 inch margin
        pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 25.4, 40); // 1 inch margin
        pdf.text(`Program: ${program}`, 25.4, 50); // 1 inch margin
        pdf.text(`Status: ${status}`, 25.4, 60); // 1 inch margin

        // Add overview section
        pdf.setFontSize(12); // Slightly larger font size for overview header
        pdf.setFont("helvetica", "bold");
        pdf.text("Overview:", 25.4, 70); // 1 inch margin
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10); // Reduced font size for overview details
        pdf.text(`Total Programs: ${totalPrograms}`, 25.4, 80); // 1 inch margin
        pdf.text(`Total Active Programs: ${totalActivePrograms}`, 25.4, 90); // 1 inch margin
        pdf.text(`Total Inactive Programs: ${totalInactivePrograms}`, 25.4, 100); // 1 inch margin
        pdf.text(`Status: Verify Account, Pending Verification, Verified`, 25.4, 110); // 1 inch margin

        // Add a new page for the program report data
        pdf.addPage();

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12); // Slightly larger font size for section header
        pdf.text("Program Report Data:", 25.4, 25.4); // 1 inch margin
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(12); // Increased font size for report data

        let y = 35.4; // 1 inch margin + 10mm
        accountReportData.forEach((item, index) => {
            if (y > 270) { // Check if we need to add a new page (297mm - 1 inch margin)
                pdf.addPage();
                y = 25.4; // Reset y coordinate for new page with 1 inch margin
            }
            pdf.text(`Record ${index + 1}:`, 25.4, y); // 1 inch margin
            y += 10;
            Object.keys(item).forEach(key => {
                const text = `${key}: ${item[key]}`;
                const lines = pdf.splitTextToSize(text, 160); // Split text to fit within 160mm width (210mm - 2 inch margin)
                lines.forEach(line => {
                    if (y > 270) {
                        pdf.addPage();
                        y = 25.4;
                    }
                    pdf.text(line, 25.4, y); // 1 inch margin
                    y += 10;
                });
            });

            // Add details for admin, applicant, and scholarship provider
            if (item.adminDetails) {
                pdf.setFont("helvetica", "bold");
                pdf.text("Admin Details:", 25.4, y);
                pdf.setFont("helvetica", "normal");
                y += 10;
                Object.keys(item.adminDetails).forEach(key => {
                    const text = `${key}: ${item.adminDetails[key]}`;
                    const lines = pdf.splitTextToSize(text, 160);
                    lines.forEach(line => {
                        if (y > 270) {
                            pdf.addPage();
                            y = 25.4;
                        }
                        pdf.text(line, 25.4, y);
                        y += 10;
                    });
                });
            }

            if (item.applicantDetails) {
                pdf.setFont("helvetica", "bold");
                pdf.text("Applicant Details:", 25.4, y);
                pdf.setFont("helvetica", "normal");
                y += 10;
                Object.keys(item.applicantDetails).forEach(key => {
                    const text = `${key}: ${item.applicantDetails[key]}`;
                    const lines = pdf.splitTextToSize(text, 160);
                    lines.forEach(line => {
                        if (y > 270) {
                            pdf.addPage();
                            y = 25.4;
                        }
                        pdf.text(line, 25.4, y);
                        y += 10;
                    });
                });
            }

            if (item.scholarshipProviderDetails) {
                pdf.setFont("helvetica", "bold");
                pdf.text("Scholarship Provider Details:", 25.4, y);
                pdf.setFont("helvetica", "normal");
                y += 10;
                Object.keys(item.scholarshipProviderDetails).forEach(key => {
                    const text = `${key}: ${item.scholarshipProviderDetails[key]}`;
                    const lines = pdf.splitTextToSize(text, 160);
                    lines.forEach(line => {
                        if (y > 270) {
                            pdf.addPage();
                            y = 25.4;
                        }
                        pdf.text(line, 25.4, y);
                        y += 10;
                    });
                });
            }

            y += 10; // Add extra space between records
        });

        pdf.save("program_report.pdf");
    };

    const loadImageToBase64 = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = url;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = (error) => reject(error);
        });
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <FaFileAlt className="mr-4 text-blue-600" /> {/* Updated icon */}
                        Generate Reports
                    </h1>
                </div>
            </header>
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white shadow rounded-lg p-6">
                                <h2 className="text-xl font-bold mb-4">Accounts Report</h2>
                                <p className="text-gray-600">Generate a detailed report of all account informations.</p>

                                                               <div className="mt-4">
                                    <label className="block text-gray-700">Start Date</label>
                                    <input
                                        type="date"
                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        max={new Date().toISOString().split("T")[0]} // Set max attribute to today's date
                                    />
                                </div>
                                
                                <div className="mt-4">
                                    <label className="block text-gray-700">End Date</label>
                                    <input
                                        type="date"
                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        min={startDate} // Set min attribute to start date
                                        max={new Date().toISOString().split("T")[0]} // Set max attribute to today's date
                                    />
                                </div>

                                <div className="mt-4">
                                    <label className="block text-gray-700">Role</label>
                                    <select
                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option value="">All Roles</option>
                                        <option value="admin">Admin</option>
                                        <option value="scholarship_provider">Scholarship Provider</option>
                                        <option value="applicant">Applicant</option>
                                    </select>
                                </div>

                                {errorMessage && (
                                    <div className="mt-4 text-red-600">
                                        {errorMessage}
                                    </div>
                                )}

                                <div className="flex mt-4">
                                    <button
                                        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                                        onClick={handleGenerateAccountReport}
                                        disabled={accountLoading}
                                    >
                                        {accountLoading ? 'Generating...' : 'Generate'}
                                    </button>
                                    {accountReportGenerated && (
                                        <button
                                            onClick={generateAccountPDF}
                                            className="ml-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                                        >
                                            Download PDF
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white shadow rounded-lg p-6">
                                <h2 className="text-xl font-bold mb-4">Scholarship Program Report</h2>
                                <p className="text-gray-600">Generate a detailed report of all scholarship programs and their statuses.</p>

                                <div className="mt-4">
                                    <label className="block text-gray-700">Program</label>
                                    <select
                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={program}
                                        onChange={(e) => setProgram(e.target.value)}
                                    >
                                        <option value="">All Programs</option>
                                        <option value="program1">Program 1</option>
                                        <option value="program2">Program 2</option>
                                        <option value="program3">Program 3</option>
                                        {/* Add more options as needed */}
                                    </select>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-gray-700">Status</label>
                                    <select
                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="completed">Completed</option>
                                        {/* Add more options as needed */}
                                    </select>
                                </div>

                                <div className="flex mt-4">
                                    <button
                                        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                                        onClick={handleGenerateProgramReport}
                                        disabled={programLoading}
                                    >
                                        {programLoading ? 'Generating...' : 'Generate'}
                                    </button>
                                    {programReportGenerated && (
                                        <button
                                            onClick={generateProgramPDF}
                                            className="ml-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                                        >
                                            Download PDF
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}