"use client";
import { getTopParticipants } from "@/actions/dataActions";
import { CrossData } from "@/types/forms";
import React, { useState } from "react";
import { generatePdf } from "@/actions/pdfActions";

const WalkathonCrossComponent: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleDownload = async (params: CrossData[]) => {
    const pdfBytes = await generatePdf(
      params,
      "Top 10 Participants - Walkathon"
    );
    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "Top10-Walkathon.pdf";

    a.click();

    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await getTopParticipants("walkathon");
    await handleDownload(res as CrossData[]);
    setLoading(false);
  };

  return (
    <div className="bg-gray-50 rounded-md shadow-md m-3 sm:w-3/4 md:w-1/2 lg:w-2/5 xl:w-1/3 mx-auto p-4 flex flex-col">
      <h1 className="text-xl font-bold mb-4 text-center">
        Top 10 Participants - Walkathon
      </h1>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black rounded-lg"
      >
        <span
          className="bg-orange-500 rounded-lg -translate-y-1 block gap-4 p-4 border-2 border-black
        text-xl hover:-translate-y-2 active:translate-x-0 active:translate-y-0 transition-all"
        >
          {loading ? "Loading..." : "Fetch Data"}
        </span>
      </button>
    </div>
  );
};

export default WalkathonCrossComponent;
