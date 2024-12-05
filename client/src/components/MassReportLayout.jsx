import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import NewLogoClean from "../assets/NewLogoClean.png";
import { MdEmail } from "react-icons/md";
import { BiPhone } from "react-icons/bi";

export default function MassReportLayout() {
  useEffect(() => {
    window.scrollTo(0, 0);
  });


  const { scholarshipId } = useParams();
  const [programDetails, setProgramDetails] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const id = scholarshipId;

  const fetchProgramDetails = async () => {
    try {
      const response = await fetch(`/api/scholarshipProgram/scholarship-programs/${id}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setProgramDetails(data);
      console.log('Program details:', data);
    } catch (error) {
      console.error('Error fetching program details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgramDetails();
  }, [id]);

  return (
    <div className="flex flex-col justify-center mt-10">
      <div className="flex mx-auto container my-2" style={{ width: '11in' }}>
        <button className="bg-blue-600 hover:bg-blue-800 px-8 py-2 rounded-md text-white">
          Print PDF
        </button>
      </div>
      <div className="flex flex-col container justify-between mx-auto bg-white border" style={{ width: '11in', height: '17in' }}>
        <div>
          <div className="flex items-center border-b p-4 my-2 justify-between">
            <div>
              <h1 className="text-2xl font-bold text-blue-600">Scholarship Report</h1>
              <p className="text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2 items-center my-2">
              <img src={NewLogoClean} alt="HubIsko Logo" className="h-10" />
              <h1 className="text-2xl text-blue-600 font-bold text-center">HubIsko</h1>
            </div>
          </div>

          <div className="p-4">
            {/* Contact person */}
            <h1 className="text-lg font-bold border-b">Contact Person</h1>
            <div className="grid grid-cols-3 gap-4 my-2 ">
              <div>
                <h1 className="text-sm font-bold">Contact Number:</h1>
                <p className="text-sm">{programDetails.contactPhone}</p>
              </div>
              <div>
                <h1 className="text-sm font-bold">Email:</h1>
                <p className="text-sm">{programDetails.contactEmail}</p>
              </div>
            </div>

            <h1 className="text-lg font-bold border-b">Scholarship Information</h1>
            <div className="grid grid-cols-3 gap-4 my-2">
              <div>
                <h1 className="text-sm font-bold">Scholarship Name:</h1>
                <p className="text-sm">{programDetails.title}</p>
              </div>
              <div>
                <h1 className="text-sm font-bold">Scholarship Status:</h1>
                <p className="text-sm">{programDetails.status}</p>
              </div>
              <div>
                <h1 className="text-sm font-bold">Scholarship Amount:</h1>
                <p className="text-sm">{programDetails.amount}</p>
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold">Slots:</h1>
                <p className="text-sm text-blue-600 font-bold">9/10</p>
              </div>
            </div>
          </div>

          <div className="mx-2">
            <table className="w-full border rounded-lg">
              <thead className="rounded-lg text-left">
                <tr>
                  <th className="border p-2">Scholar</th>
                  <th className="border p-2">Contact Number</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">School</th>
                  <th className="border p-2">Course</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">Name</td>
                  <td className="border p-2">Number</td>
                  <td className="border p-2">Email</td>
                  <td className="border p-2">School</td>
                  <td className="border p-2">Course</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between p-4 bg-blue-100">
          <div>
            <p className="text-sm text-gray-500">Generated Progress by HubIsko</p>
          </div>
          <div>
            <p className="flex gap-1 text-sm text-gray-500 items-center">
              <MdEmail className="inline" />
              HubIsko@email.com
            </p>
          </div>
          <div>
            <p className="flex gap-1 text-sm text-gray-500 items-center">
              <BiPhone className="inline" />
              09123456789
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-end mx-auto container my-2" style={{ width: '11in' }}>
        <button className="bg-blue-600 hover:bg-blue-800 px-8 py-2 rounded-md text-white">
          Print PDF
        </button>
      </div>
    </div>
  );
}