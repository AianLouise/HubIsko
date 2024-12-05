import React, { useEffect, useState } from "react";
import { FaFileAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from "react-redux";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../../assets/NewLogo.png';

export default function AdminSettings() {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [selectedTab, setSelectedTab] = useState('Update Information');
    const [startDate, setStartDate] = useState('');
    const [startDate2, setStartDate2] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endDate2, setEndDate2] = useState('');
    const [role, setRole] = useState('');
    const [program, setProgram] = useState('');
    const [status, setStatus] = useState('');
    const [provider, setProvider] = useState('');
    const [providers, setProviders] = useState([]);
    const [accountReportGenerated, setAccountReportGenerated] = useState(false);
    const [programReportGenerated, setProgramReportGenerated] = useState(false);
    const [accountLoading, setAccountLoading] = useState(false);
    const [programLoading, setProgramLoading] = useState(false);
    const [accountReportData, setAccountReportData] = useState(null);
    const [programReportData, setProgramReportData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessage2, setErrorMessage2] = useState('');

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

    useEffect(() => {
        // Fetch the list of verified scholarship providers
        const fetchProviders = async () => {
            try {
                const response = await fetch('/api/admin/verified-scholarship-providers');
                const data = await response.json();
                setProviders(data);
            } catch (error) {
                console.error('Error fetching providers:', error);
            }
        };

        fetchProviders();
    }, []);

    const fetchProgramReportData = async () => {
        try {
            const response = await fetch('/api/admin/program-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    startDate: startDate2,
                    endDate: endDate2,
                    provider,
                    status,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching program report data:', error);
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

    const handleGenerateProgramReport = async () => {
        // Validate that both startDate2 and endDate2 are provided together
        if ((startDate2 && !endDate2) || (!startDate2 && endDate2)) {
            setErrorMessage2('Please provide both start date and end date.');
            return;
        }

        // Validate that endDate2 is not earlier than startDate2
        if (startDate2 && endDate2 && new Date(endDate2) < new Date(startDate2)) {
            setErrorMessage2('End date cannot be earlier than start date.');
            return;
        }

        // Clear any previous error messages
        setErrorMessage2('');
        setProgramLoading(true);

        // Fetch the program report data
        const data = await fetchProgramReportData();
        if (data) {
            setProgramReportData(data);
            setProgramReportGenerated(true);
        } else {
            setErrorMessage2('Failed to generate the report. Please try again.');
        }

        setProgramLoading(false);
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

        // Add header section with a thinner border and reduced gaps
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 10;
        const headerHeight = 35; // Adjusted height for compact spacing

        // Add a smaller border with thickness 0.2
        pdf.setLineWidth(0.2);
        pdf.rect(margin, margin, pageWidth - 2 * margin, headerHeight); // Border for header section

        // Calculate the vertical middle of the header section
        const headerMiddleY = margin + headerHeight / 2;

        // Calculate the center of the page for horizontal alignment
        const centerX = pageWidth / 2;

        // Add a smaller logo above the "HubIsko Account Report" text
        const logoWidth = 10; // Smaller logo size
        const logoHeight = 10;
        const logoX = centerX - logoWidth / 2; // Center the logo horizontally
        const logoY = margin + 5; // Slightly below the top margin
        pdf.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight); // Add the logo

        // Add "HubIsko Account Report" text centered horizontally below the logo
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12); // Smaller font for title
        const title = "HubIsko Account Report";
        const titleWidth = pdf.getTextWidth(title);
        pdf.text(title, centerX - titleWidth / 2, logoY + logoHeight + 4); // Reduced gap below the logo

        // Add the description text below the title, centered horizontally
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10); // Smaller font for description
        const description = "This report contains detailed information about account informations.";
        const descriptionWidth = pdf.getTextWidth(description);
        pdf.text(description, centerX - descriptionWidth / 2, logoY + logoHeight + 10); // Reduced gap below the title

        // Add the generated date directly below the description, with no extra space
        const generatedDate = `Generated on:${new Date().toLocaleString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
        })}`;
        const dateWidth = pdf.getTextWidth(generatedDate);
        pdf.text(generatedDate, centerX - dateWidth / 2, logoY + logoHeight + 14); // Directly aligned below the description


        if (startDate) {
            pdf.text(`Start Date: ${startDate}`, 25.4, 50); // 1 inch margin
        }

        if (endDate) {
            pdf.text(`End Date: ${endDate}`, 25.4, 60); // 1 inch margin
        }
        if (role) {
            pdf.text(`Role: ${role}`, 25.4, 70); // 1 inch margin
        }

        // Add overview section as a table
        const tableStartX = 25.4; // 1 inch margin
        const tableStartY = 80;
        const rowHeight = 10;
        const colWidth = 60;

        // Set font for table header
        pdf.setFontSize(12); // Slightly larger font size for overview header
        pdf.setFont("helvetica", "bold");
        pdf.text("Overview:", tableStartX, tableStartY);

        // Add some space after the "Overview:" text
        const tableContentStartY = tableStartY + rowHeight;

        // Set font for table content
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(12); // Reduced font size for overview details

        // Define table data
        const tableData = [
            { label: "Total Users", value: totalUsers },
            { label: "Verify Account", value: verifyAccountCount },
            { label: "Pending Verification", value: pendingVerificationCount },
            { label: "Verified", value: verifiedCount },
            { label: "Total Applicants", value: totalApplicants },
            { label: "Total Scholarship Providers", value: totalScholarshipProviders },
            { label: "Total Admins", value: totalAdmins }
        ];

        // Draw table rows with borders and center the values
        tableData.forEach((row, index) => {
            const y = tableContentStartY + (index + 1) * rowHeight;
            pdf.text(row.label, tableStartX + 2, y - 2); // Adjust text position

            // Center the value text
            const valueTextWidth = pdf.getTextWidth(row.value.toString());
            const valueTextX = tableStartX + colWidth + (colWidth - valueTextWidth) / 2;
            pdf.text(row.value.toString(), valueTextX, y - 2); // Adjust text position

            // Draw border for each row
            pdf.rect(tableStartX, y - rowHeight, colWidth, rowHeight); // Border for label column
            pdf.rect(tableStartX + colWidth, y - rowHeight, colWidth, rowHeight); // Border for value column
        });

        // Add a new page for the account report data
        pdf.addPage();

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12); // Slightly larger font size for section header
        pdf.text("Account Report Data:", 25.4, 25.4); // 1 inch margin
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10); // Increased font size for report data

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
            if (index > 0) {
                pdf.addPage();
                y = 25.4; // Reset y coordinate for new page with 1 inch margin
            }
            pdf.setFont("helvetica", "bold");
            pdf.text(`Record ${index + 1}:`, 25.4, y); // 1 inch margin
            pdf.setFont("helvetica", "normal"); // Reset font to normal for subsequent text
            y += 10;
            addDetails(item, 0, true); // Skip nested objects

            // Add details for admin, applicant, and scholarship provider
            if (item.adminDetails) {
                pdf.setFont("helvetica", "bold");
                pdf.text("Admin Details:", 25.4, y);
                pdf.setFont("helvetica", "normal");
                y += 10;
                addDetails(item.adminDetails, 2);
            } else {
                pdf.setFont("helvetica", "bold");
                pdf.text("Admin Details:", 25.4, y);
                pdf.setFont("helvetica", "normal");
                y += 10;
                pdf.text("No admin details available.", 25.4, y);
                y += 10;
            }

            if (item.applicantDetails) {
                pdf.setFont("helvetica", "bold");
                pdf.text("Applicant Details:", 25.4, y);
                pdf.setFont("helvetica", "normal");
                y += 10;
                addDetails(item.applicantDetails, 2);
            } else {
                pdf.setFont("helvetica", "bold");
                pdf.text("Applicant Details:", 25.4, y);
                pdf.setFont("helvetica", "normal");
                y += 10;
                pdf.text("No applicant details available.", 25.4, y);
                y += 10;
            }

            if (item.scholarshipProviderDetails) {
                pdf.setFont("helvetica", "bold");
                pdf.text("Scholarship Provider Details:", 25.4, y);
                pdf.setFont("helvetica", "normal");
                y += 10;
                addDetails(item.scholarshipProviderDetails, 2);
            } else {
                pdf.setFont("helvetica", "bold");
                pdf.text("Scholarship Provider Details:", 25.4, y);
                pdf.setFont("helvetica", "normal");
                y += 10;
                pdf.text("No scholarship provider details available.", 25.4, y);
                y += 10;
            }

            y += 10; // Add extra space between records
        });

        pdf.save("account_report.pdf");
    };

    const generateProgramPDF = async () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const logoBase64 = await loadImageToBase64(logo); // Convert logo to base64

        // Define the variables for the overview section
        const totalPrograms = programReportData ? programReportData.length : 0;
        const totalPendingApproval = programReportData ? programReportData.filter(program => program.status === 'Pending Approval').length : 0;
        const totalApproved = programReportData ? programReportData.filter(program => program.status === 'Approved').length : 0;
        const totalPublished = programReportData ? programReportData.filter(program => program.status === 'Published').length : 0;
        const totalOngoing = programReportData ? programReportData.filter(program => program.status === 'Ongoing').length : 0;
        const totalRejected = programReportData ? programReportData.filter(program => program.status === 'Rejected').length : 0;
        const totalArchived = programReportData ? programReportData.filter(program => program.status === 'Archived').length : 0;
        const totalCancelled = programReportData ? programReportData.filter(program => program.status === 'Cancelled').length : 0;
        const totalCompleted = programReportData ? programReportData.filter(program => program.status === 'Completed').length : 0;
        const totalAwaitingPublication = programReportData ? programReportData.filter(program => program.status === 'Awaiting Publication').length : 0;
        const totalPaused = programReportData ? programReportData.filter(program => program.status === 'Paused').length : 0;

        // Log the report data to the console
        console.log("Program Report Data:", programReportData);

        // Add header section with a thinner border and reduced gaps
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 10;
        const headerHeight = 35; // Adjusted height for compact spacing

        // Add a smaller border with thickness 0.2
        pdf.setLineWidth(0.2);
        pdf.rect(margin, margin, pageWidth - 2 * margin, headerHeight); // Border for header section

        // Calculate the vertical middle of the header section
        const headerMiddleY = margin + headerHeight / 2;

        // Calculate the center of the page for horizontal alignment
        const centerX = pageWidth / 2;

        // Add a smaller logo above the "HubIsko Program Report" text
        const logoWidth = 10; // Smaller logo size
        const logoHeight = 10;
        const logoX = centerX - logoWidth / 2; // Center the logo horizontally
        const logoY = margin + 5; // Slightly below the top margin
        pdf.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight); // Add the logo

        // Add "HubIsko Program Report" text centered horizontally below the logo
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12); // Smaller font for title
        const title = "HubIsko Program Report";
        const titleWidth = pdf.getTextWidth(title);
        pdf.text(title, centerX - titleWidth / 2, logoY + logoHeight + 4); // Reduced gap below the logo

        // Add the description text below the title, centered horizontally
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10); // Smaller font for description
        const description = "This report contains detailed information about program activities and statuses.";
        const descriptionWidth = pdf.getTextWidth(description);
        pdf.text(description, centerX - descriptionWidth / 2, logoY + logoHeight + 10); // Reduced gap below the title

        // Add the generated date directly below the description, with no extra space
        const generatedDate = `Generated on:${new Date().toLocaleString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
        })}`;
        const dateWidth = pdf.getTextWidth(generatedDate);
        pdf.text(generatedDate, centerX - dateWidth / 2, logoY + logoHeight + 14); // Directly aligned below the description

        // Add overview section as a table
        const tableStartX = 25.4; // 1 inch margin
        const tableStartY = 80;
        const rowHeight = 10;
        const colWidth = 60;

        // Set font for table header
        pdf.setFontSize(12); // Slightly larger font size for overview header
        pdf.setFont("helvetica", "bold");
        pdf.text("Overview:", tableStartX, 70); // 1 inch margin

        // Add some space after the "Overview:" text
        const tableContentStartY = tableStartY;

        // Set font for table content
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10); // Reduced font size for overview details

        // Define table data
        const tableData = [
            { label: "Total Programs", value: totalPrograms },
            { label: "Awaiting Publication", value: totalAwaitingPublication },
            { label: "Published", value: totalPublished },
            { label: "Ongoing", value: totalOngoing },
            { label: "Paused", value: totalPaused },
            { label: "Completed", value: totalCompleted },
        ];

        // Draw table rows with borders and center the values
        tableData.forEach((row, index) => {
            const y = tableContentStartY + (index + 1) * rowHeight;
            pdf.text(row.label, tableStartX + 2, y - 2); // Adjust text position

            // Center the value text
            const valueTextWidth = pdf.getTextWidth(row.value.toString());
            const valueTextX = tableStartX + colWidth + (colWidth - valueTextWidth) / 2;
            pdf.text(row.value.toString(), valueTextX, y - 2); // Adjust text position

            // Draw border for each row
            pdf.rect(tableStartX, y - rowHeight, colWidth, rowHeight); // Border for label column
            pdf.rect(tableStartX + colWidth, y - rowHeight, colWidth, rowHeight); // Border for value column
        });

        // Add a new page for the program report data
        pdf.addPage();

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12); // Slightly larger font size for section header
        pdf.text("Program Report Data:", 25.4, 25.4); // 1 inch margin
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10); // Increased font size for report data

        let y = 35.4; // 1 inch margin + 10mm
        programReportData.forEach((item, index) => {
            if (index > 0) {
                pdf.addPage();
                y = 25.4; // Reset y coordinate for new page with 1 inch margin
            }
            pdf.setFont("helvetica", "bold");
            pdf.text(`Record ${index + 1}:`, 25.4, y); // 1 inch margin
            pdf.setFont("helvetica", "normal"); // Reset font to normal for subsequent text
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
                                    <label className="block text-gray-700">Start Date</label>
                                    <input
                                        type="date"
                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={startDate2}
                                        onChange={(e) => setStartDate2(e.target.value)}
                                        max={new Date().toISOString().split("T")[0]} // Set max attribute to today's date
                                    />
                                </div>

                                <div className="mt-4">
                                    <label className="block text-gray-700">End Date</label>
                                    <input
                                        type="date"
                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={endDate2}
                                        onChange={(e) => setEndDate2(e.target.value)}
                                        min={startDate2} // Set min attribute to start date
                                        max={new Date().toISOString().split("T")[0]} // Set max attribute to today's date
                                    />
                                </div>

                                <div className="mt-4">
                                    <label className="block text-gray-700">Provider</label>
                                    <select
                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={provider}
                                        onChange={(e) => setProvider(e.target.value)}
                                    >
                                        <option value="">All Providers</option>
                                        {providers.map((provider) => (
                                            <option key={provider._id} value={provider.scholarshipProviderDetails.organizationName}>
                                                {provider.scholarshipProviderDetails.organizationName}
                                            </option>
                                        ))}
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
                                        <option value="Pending Approval">Pending Approval</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Published">Published</option>
                                        <option value="Ongoing">Ongoing</option>
                                        <option value="Rejected">Rejected</option>
                                        <option value="Archived">Archived</option>
                                        <option value="Cancelled">Cancelled</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Awaiting Publication">Awaiting Publication</option>
                                        <option value="Paused">Paused</option>
                                    </select>
                                </div>

                                {errorMessage2 && (
                                    <div className="mt-4 text-red-600">
                                        {errorMessage2}
                                    </div>
                                )}

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