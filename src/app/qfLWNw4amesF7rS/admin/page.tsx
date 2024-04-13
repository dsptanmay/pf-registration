"use client";
import { getParticipants } from "@/actions/dataActions";
import React, { use, useState } from "react";

const AdminPage = () => {
  const [participantsData, setParticipantsData] = useState("");
  const handleSubmit = async (category: "boys" | "girls" | "walkathon") => {
    const data = await getParticipants(category);
    console.log(data);
  };
  return (
    <div className="h-screen max-h-screen flex flex-col justify-center items-center align-middle bg-gradient-to-br from-orange-500/60 via-blue-300 to-purple-400/80">
      <h1 className="text-2xl font-semibold">Admin Page</h1>
      <button
        className="bg-orange-300 m-2 rounded-md p-3 drop-shadow-md"
        onClick={() => {
          handleSubmit("boys");
        }}
      >
        Top 20 - Boys
      </button>
      <button
        className="bg-orange-300 m-2 rounded-md p-3 drop-shadow-md"
        onClick={() => {
          handleSubmit("girls");
        }}
      >
        Top 20 - Girls
      </button>
      <button
        className="bg-orange-300 m-2 rounded-md p-3 drop-shadow-md"
        onClick={() => {
          handleSubmit("walkathon");
        }}
      >
        Top 20 - Walkathon
      </button>
    </div>
  );
};

export default AdminPage;
