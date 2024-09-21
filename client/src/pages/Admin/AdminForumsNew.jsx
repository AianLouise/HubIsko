import React, { useState, useEffect } from "react";
import { MdClearAll } from "react-icons/md";
import { PiStudentFill } from "react-icons/pi";
import { FaBuilding, FaWrench } from "react-icons/fa6";
import { IoMegaphoneSharp } from "react-icons/io5";
import { FaList } from "react-icons/fa";
import { BsFillGridFill } from "react-icons/bs";
import AllPosts from "../../components/AdminForums/Allposts";
import StudentPosts from "../../components/AdminForums/StudentPosts";
import ProviderPosts from "../../components/AdminForums/ProviderPosts";
import AnnouncementsPosts from "../../components/AdminForums/AnnouncementPosts";
import AdminPosts from "../../components/AdminForums/AdminPosts";

export default function AdminForumsNew() {
  const [isGridView, setIsGridView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedView, setSelectedView] = useState("All Posts");
  const [totalPosts, setTotalPosts] = useState(0);
  const itemsPerPage = 6;
  const itemsPerGrid = 6;

  useEffect(() => {
    const fetchTotalPosts = async () => {
      try {
        const response = await fetch('/api/adminForums/forum-posts'); // Fetch all posts from the backend
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTotalPosts(data.length); // Set the total number of posts
      } catch (error) {
        console.error('Error fetching total posts:', error);
      }
    };

    fetchTotalPosts();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderSelectedView = () => {
    switch (selectedView) {
      case "All Posts":
        return (
          <AllPosts
            isGridView={isGridView}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            itemsPerGrid={itemsPerGrid}
            itemsPerPage={itemsPerPage}
          />
        );
      case "Student Posts":
        return (
          <StudentPosts
            isGridView={isGridView}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            itemsPerGrid={itemsPerGrid}
            itemsPerPage={itemsPerPage}
          />
        );
      case "Provider Posts":
        return <ProviderPosts
          isGridView={isGridView}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          itemsPerGrid={itemsPerGrid}
          itemsPerPage={itemsPerPage}
        />;
      case "Announcements":
        return <AnnouncementsPosts
          isGridView={isGridView}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          itemsPerGrid={itemsPerGrid}
          itemsPerPage={itemsPerPage}
        />;
      case "Admin Posts":
        return <AdminPosts
          isGridView={isGridView}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          itemsPerGrid={itemsPerGrid}
          itemsPerPage={itemsPerPage}

        />;
      default:
        return <AllPosts />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-medium text-slate-700">
      <main className="flex-grow bg-[#f8f8fb] pb-24">
        <div className="max-w-8xl mx-auto px-24 gap-10 flex-col flex mt-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-wide">Forums</h1>

          <div className="flex gap-10 h-[550px]">

            {/* Section 1 */}
            <div className="flex flex-col justify-between w-1/6 bg-white shadow border rounded-md p-4 h-full">
              <div className="flex flex-col items-center">
                <button className="bg-blue-600 w-full text-white px-6 py-2 mb-4 rounded-md">
                  Create a New post
                </button>

                <div className="flex flex-col gap-2 w-full items-start justify-start">
                  <button
                    onClick={() => setSelectedView("All Posts")}
                    className={`flex items-center gap-2 ${selectedView === "All Posts" ? 'bg-blue-600 text-white' : 'bg-slate-100  hover:bg-slate-300  hover:text-slate-800'} text-slate-500 w-full text-left p-2 px-4 rounded-md`}
                  >
                    <MdClearAll className="text-xl" />
                    All Posts
                  </button>

                  <button
                    onClick={() => setSelectedView("Student Posts")}
                    className={`flex items-center gap-2 ${selectedView === "Student Posts" ? 'bg-blue-600 text-white' : 'bg-slate-100  hover:bg-slate-300  hover:text-slate-800'} text-slate-500 w-full text-left p-2 px-4 rounded-md`}
                  >
                    <PiStudentFill className="text-xl" />
                    Student Posts
                  </button>

                  <button
                    onClick={() => setSelectedView("Provider Posts")}
                    className={`flex items-center gap-2 ${selectedView === "Provider Posts" ? 'bg-blue-600 text-white' : 'bg-slate-100  hover:bg-slate-300  hover:text-slate-800'} text-slate-500 w-full text-left p-2 px-4 rounded-md`}
                  >
                    <FaBuilding className="text-xl" />
                    Provider Posts
                  </button>

                  <button
                    onClick={() => setSelectedView("Announcements")}
                    className={`flex items-center gap-2 ${selectedView === "Announcements" ? 'bg-blue-600 text-white' : 'bg-slate-100  hover:bg-slate-300  hover:text-slate-800'} text-slate-500 w-full text-left p-2 px-4 rounded-md`}
                  >
                    <IoMegaphoneSharp className="text-xl" />
                    Announcements
                  </button>

                  <button
                    onClick={() => setSelectedView("Admin Posts")}
                    className={`flex items-center gap-2 ${selectedView === "Admin Posts" ? 'bg-blue-600 text-white' : 'bg-slate-100  hover:bg-slate-300  hover:text-slate-800'} text-slate-500 w-full text-left p-2 px-4 rounded-md`}
                  >
                    <FaWrench className="text-xl" />
                    Admin Posts
                  </button>
                </div>
              </div>

              <span>Posts: {totalPosts}</span>
            </div>

            {/* Section 2 */}
            <div className="flex flex-col gap-4 w-5/6 h-full">

              <h1 className="text-2xl font-bold border-b pb-2 text-slate-900 tracking-wide">
                {selectedView}
              </h1>
              <div className="flex gap-4 justify-between items-center">
                <div className="flex gap-4 items-center">
                  <input type="text" placeholder="Search" className="border rounded-md p-2 px-4" />

                  <select className="border rounded-md p-2 text-blue-600 px-4">
                    <option value=''>Sort by</option>
                    <option value=''>Newest</option>
                    <option value=''>Oldest</option>
                  </select>
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

              {renderSelectedView()}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <span className="border-b pb-2">Forum Activity</span>

            <div className="flex flex-col divide-y border shadow bg-white p-4 rounded-md">
              <div className="flex items-center py-4 gap-2">
                <div className="bg-blue-600 w-10 h-10 rounded-full"></div>
                <span>Name posted: <span className="text-blue-600">Title of the post</span></span>
              </div>

              <div className="flex items-center py-4 gap-2">
                <div className="bg-blue-600 w-10 h-10 rounded-full"></div>
                <span>Name commented on: <span className="text-blue-600">Title of the post</span></span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}