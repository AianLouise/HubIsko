import React, { useState, useEffect } from "react";
import { BiFilter } from "react-icons/bi";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import ForumDetail from "../../components/ForumDetail";

export default function AdminForumDetail() {

  return (
    <div className="flex flex-col min-h-screen">
      <Layout />
      <main className="flex-grow bg-[#f8f8fb] font-medium text-slate-700">
       
        <ForumDetail />

      </main>
    </div>
  );
}