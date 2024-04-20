import { getSITParticipants } from "@/actions/dataActions";
import { generateSITPDF } from "@/actions/pdfActions";
import { SITData } from "@/types/forms";
import React, { useState } from "react";

const SITParticipants = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleDownload = async (params: SITData[]) => {
    const pdfBytes = await generateSITPDF(params);
    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "SIT_Participants.pdf";

    a.click();

    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await getSITParticipants();
    await handleDownload(res);
    setLoading(false);
  };
  return (
    <div className="bg-gray-50 rounded-md shadow-md m-3 sm:w-3/4 md:w-1/2 lg:w-2/5 xl:w-1/3 mx-auto p-4 flex flex-col">
      <h1 className="text-xl font-bold mb-4 text-center">SIT Participants</h1>
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

export default SITParticipants;
