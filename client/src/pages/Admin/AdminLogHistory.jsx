import React, { useEffect } from "react";
import { FaHistory, FaClipboardList } from "react-icons/fa";
import { MdHistory } from "react-icons/md";
import LogHistory from '../../components/AdminSettings/LogHistory';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function AdminLogHistory() {
  useEffect(() => {
    document.title = "Log History | HubIsko";
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <main className="flex-grow">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">Log History</h1>
                <p className="text-blue-100 text-base font-medium">
                  View and analyze system activity logs and admin actions
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                <MdHistory className="text-white text-4xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Log History Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden">
            <div className="p-6">
              <LogHistory apiUrl={apiUrl} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}