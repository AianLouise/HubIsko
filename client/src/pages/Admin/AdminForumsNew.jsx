import React, {useState} from "react";
import { MdClearAll } from "react-icons/md";
import { PiStudentFill } from "react-icons/pi";
import { FaBuilding , FaWrench } from "react-icons/fa6";
import { IoMegaphoneSharp } from "react-icons/io5";
import { FaList } from "react-icons/fa";
import { BsFillGridFill } from "react-icons/bs";



export default function AdminForumsNew() {
    const [isGridView, setIsGridView] = useState(false);

    const toggleView = () => {
      setIsGridView(!isGridView);
    };
    
    return (
        <div className="flex flex-col min-h-screen font-medium text-slate-700">
        <main className="flex-grow bg-[#f8f8fb] pb-24">
            <div className='max-w-8xl mx-auto px-24 gap-10 flex-col flex mt-16'>
                <h1 className="text-2xl font-bold text-slate-900 tracking-wide">Forums</h1>

                <div className="flex gap-10">
                <div className="flex justify-between flex-col w-1/6 bg-white shadow border rounded-md max-h-[500px] h-[500px] p-4">
                    <div className="flex flex-col items-center">
                    <button className="bg-blue-600 w-full text-white px-6 py-2 mb-4 rounded-md">
                        Create a New post</button>

                    <div className="flex flex-col gap-2 w-full items-start justify-start">
                        <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-300 hover:text-slate-800 text-slate-500 w-full text-left p-2 px-4 rounded-md">
                        <MdClearAll className="text-xl" />
                        All Posts</button>

                        <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-300 hover:text-slate-800 text-slate-500 w-full text-left p-2 px-4  rounded-md">
                        <PiStudentFill className="text-xl" />
                        Student Posts</button>

                        <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-300 hover:text-slate-800 text-slate-500 w-full text-left p-2 px-4  rounded-md">
                        <FaBuilding className="text-xl" />
                        Provider Posts
                        </button>

                        <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-300 hover:text-slate-800 text-slate-500 w-full text-left p-2 px-4  rounded-md">
                        <IoMegaphoneSharp className="text-xl" />
                        Announcements</button>

                        <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-300 hover:text-slate-800 text-slate-500 w-full text-left p-2 px-4 rounded-md">
                        <FaWrench className="text-xl" />
                        Admin Posts</button>
                    </div>
                    </div>

                    <span>Posts: 000</span>
                </div>


                <div className="flex gap-4 flex-col w-5/6">
                
                <div className="flex gap-4 justify-between items-center">
                    <div className="flex gap-4 items-center">
                    <input type="text" placeholder="Search" className=" border rounded-md p-2 px-4" />
                    </div>
                    <div className="flex gap-2 items-center">
                        <button
                            onClick={() => setIsGridView(false)}
                            className={`p-2 rounded-full ${!isGridView ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}
                        >
                            <FaList className="text-lg" />
                        </button>
                        <button
                            onClick={() => setIsGridView(true)}
                            className={`p-2 rounded-full ${isGridView ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}
                        >
                            <BsFillGridFill className="text-lg" />
                        </button>
                        </div>
                </div>

                <h1 className="border-b py-2">Admin Announcements</h1>
                {isGridView ? (
                    <div className="grid grid-cols-3 gap-5 h-full">
                    <div className="bg-white flex justify-center items-center border shadow rounded-md">
                        <span>Container</span>
                    </div>
                    <div className="bg-white flex justify-center items-center border shadow rounded-md">
                        <span>Container</span>
                    </div>
                    <div className="bg-white flex justify-center items-center border shadow rounded-md">
                        <span>Container</span>
                    </div>
                    </div>
                ) : (
                    <div className="border rounded-md bg-white">
                    <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">Container 1</td>
                        <td className="px-6 py-4 whitespace-nowrap">Description 1</td>
                        <td className="px-6 py-4 whitespace-nowrap">Date 1</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="text-blue-600 hover:text-blue-900">Edit</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">Container 2</td>
                        <td className="px-6 py-4 whitespace-nowrap">Description 2</td>
                        <td className="px-6 py-4 whitespace-nowrap">Date 2</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="text-blue-600 hover:text-blue-900">Edit</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">Container 3</td>
                        <td className="px-6 py-4 whitespace-nowrap">Description 3</td>
                        <td className="px-6 py-4 whitespace-nowrap">Date 3</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="text-blue-600 hover:text-blue-900">Edit</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                    </div>
                )}
                </div>
                </div>
            </div>
        </main>
        </div>
    );
}