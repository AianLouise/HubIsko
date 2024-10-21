import React from "react";
import { FaHistory } from "react-icons/fa"; // Import the icon
import LogHistory from '../../components/AdminSettings/LogHistory'; // Import LogHistory

export default function AdminLogHistory() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaHistory className="mr-4 text-blue-600" /> {/* Add the icon */}
            Log History
          </h1>
        </div>
      </header>
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg p-6">
              <LogHistory /> {/* Add LogHistory component */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}