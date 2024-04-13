"use client";
import { getTopParticipants } from "@/actions/dataActions";
import { CrossData } from "@/types/forms";
import React, { useState } from "react";
import ListItem from "@/components/ListItem";

const BoysCrossComponent: React.FC = () => {
  const [data, setData] = useState<CrossData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showData, setShowData] = useState<boolean>(false);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await getTopParticipants("boys");
    setData(res);
    setShowData(true);
    setLoading(false);
  };

  const handleClose = () => {
    setShowData(false);
  };

  return (
    <div className="bg-gray-50 rounded-md shadow-md m-3 sm:w-3/4 md:w-1/2 lg:w-2/5 xl:w-1/3 mx-auto p-4">
      <h1 className="text-xl font-bold mb-4 text-center">
        Top 20 Participants - Boys
      </h1>
      {!showData && (
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-orange-400 text-white px-4 py-2 rounded-md w-full mb-4"
        >
          {loading ? "Loading..." : "Fetch Data"}
        </button>
      )}

      {showData && (
        <div>
          <ul>
            {data.map((participant, idx) => (
              <ListItem key={idx} item={participant} />
            ))}
          </ul>
          <button
            onClick={handleClose}
            className="bg-red-500 text-white px-2 py-1 rounded-md relative bottom-4"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default BoysCrossComponent;
