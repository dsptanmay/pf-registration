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
          placeholder="Enter your registered email address"
          className="mb-4 px-10 py-5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          Submit
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default GetCertificateComponent;
