"use client";
import { generateCertificate } from "@/actions/certActions";
import { getOneParticipant } from "@/actions/dataActions";

import { toastOpts } from "@/utils/freq";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import * as z from "zod";

import pfLogo from "../../public/pf-white.png";
import Image from "next/image";

const schema = z.string().regex(/^\d{5}[A-Z]$/);

const GetCertificateComponent = () => {
  const [uniqueCode, setUniqueCode] = useState("");
  const [error, setErrors] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await getOneParticipant(uniqueCode);
      if (res === undefined)
        toast.error("Could not find participant!", toastOpts);
      else {
        setLoading(true);
        const pdfBytes = await generateCertificate(res.name as string);
        const blob = new Blob([pdfBytes], { type: "application/pdf" });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");

        document.appendChild(a);

        a.href = url;
        a.download = "CertificateOfParticipation.pdf";
        a.click();

        toast.success("Certificate downloaded successfully!", toastOpts);
        window.URL.revokeObjectURL(url);
        document.removeChild(a);
        setLoading(false);
      }
      setUniqueCode("");
      setErrors("");
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors(err.issues[0].message);
      } else {
        console.warn(`Error: ${err}`);
      }
    }
  };
  return (
    <div className="h-screen flex flex-col align-middle items-center justify-center bg-gradient-to-br from-orange-500/40 via-blue-400 to-purple-400">
      <Image
        src={pfLogo}
        alt="pf logo"
        height={150}
        className="absolute top-[1rem]"
      />
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="text"
          name="unique_code"
          value={uniqueCode}
          onChange={(e) => setUniqueCode(e.target.value)}
          placeholder="Enter your Unique Code"
          className="mb-4 px-10 py-5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 drop-shadow-md"
        />
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <button type="submit" className="bg-black rounded-lg">
          <span className="block p-4 border-black border-2 -translate-y-1 bg-orange-400 rounded-lg text-white text-xl font-semibold hover:-translate-y-2 transition-all active:translate-x-0 active:translate-y-0">
            {!loading && "Submit"}
            {loading && "Loading"}
          </span>
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default GetCertificateComponent;
