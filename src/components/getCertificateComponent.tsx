"use client";
import { sendCertificateEmail } from "@/actions/certActions";
import { getOneParticipant } from "@/actions/dataActions";

import { toastOpts } from "@/utils/freq";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import * as z from "zod";

import pfLogo from "../../public/pf-white.png";
import Image from "next/image";

const schema = z.string().email("Invalid Email Address");

const GetCertificateComponent = () => {
  const [email, setEmail] = useState("");
  const [error, setErrors] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      schema.parse(email);
      const res = await getOneParticipant(email);
      if (res.length === 0) toast.error("Could not find email!", toastOpts);
      else {
        sendCertificateEmail(res[0].name as string, res[0].email as string);
        toast.success(
          "Mail sent to your email account successfully!",
          toastOpts
        );
      }
      setEmail("");
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
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your registered email id"
          className="mb-4 px-10 py-5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 drop-shadow-md"
        />
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <button type="submit" className="bg-black rounded-lg">
          <span className="block p-4 border-black border-2 -translate-y-1 bg-orange-400 rounded-lg text-white text-xl font-semibold hover:-translate-y-2 transition-all active:translate-x-0 active:translate-y-0">
            Submit
          </span>
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default GetCertificateComponent;
