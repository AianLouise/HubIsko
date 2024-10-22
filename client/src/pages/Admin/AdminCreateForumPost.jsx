import React, { useState, useEffect } from "react";
import { BiFilter } from "react-icons/bi";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import CreateForumPost from "../../components/Forum/CreateForumPostForm";
import { FaArrowUp } from "react-icons/fa"; // Import the icon

export default function AdminCreateForum() {
  const [showScroll, setShowScroll] = useState(false);

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 400) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400) {
      setShowScroll(false);
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollTop);
    return () => {
      window.removeEventListener("scroll", checkScrollTop);
    };
  }, [showScroll]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-[#f8f8fb] font-medium text-slate-700">
        <CreateForumPost />
      </main>
      {showScroll && (
        <button
          className="fixed bottom-10 right-10 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
          onClick={scrollTop}
        >
          <FaArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}