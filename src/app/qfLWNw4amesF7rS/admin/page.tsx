"use client";
import BoysCrossComponent from "@/components/BoysTop20";
import GirlsCrossComponent from "@/components/GirlsTop20";
import WalkCrossComponent from "@/components/WalkathonTop10";
import React from "react";

const AdminPage = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-orange-500/40 via-blue-300 to-purple-300 flex flex-col justify-center">
      <h1 className="font-bold text-4xl text-center mb-5 text-gray-900"> Admin Page</h1>
      <BoysCrossComponent />
      <GirlsCrossComponent />
      <WalkCrossComponent />
    </div>
  );
};

export default AdminPage;
