"use client";

import { getOneParticipant } from "@/actions/dataActions";
import { generateCertificatePDF } from "@/actions/pdfActions";
import { toastOpts } from "@/utils/freq";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";

import { z } from "zod";

const ucSchema = z.object({
  unique_code: z
    .string()
    .length(6, "Unique code must be 6 alphanumeric characters")
    .regex(/^\d{5}[A-Z]$/, "Unique code must be alphanumeric"),
});

type formData = z.infer<typeof ucSchema>;

const GetCertificateComponent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>({ resolver: zodResolver(ucSchema) });
  const [uniqueCode, setUniqueCode] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: formData) => {
    setLoading(true);
    const res = await getOneParticipant(event.unique_code);
    if (res.length === 0) {
      toast.error("Participant not found!", toastOpts);
    } else {
      try {
        toast.success("Certificate Downloading...", toastOpts);
        const name = res[0].name.trim();

        const pdfBytes = await generateCertificatePDF(name);

        const blob = new Blob([pdfBytes], { type: "application/pdf" });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = `CertificateOfParticipation-${name}.pdf`;

        a.click();

        window.URL.revokeObjectURL(url);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
  };
  return (
    <div className="h-screen bg-gradient-to-br from-orange-400 to-purple-400 flex items-center justify-center">
      <div className="bg-white p-10 rounded-lg drop-shadow-lg w-auto h-1/2 flex flex-col justify-center items-center gap-4">
        <h1 className="font-bold text-3xl text-center">
          Download your Certificate
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            id="unique_code"
            {...register("unique_code")}
            className="p-4 border border-gray-500 rounded-lg drop-shadow-md active:border-blue-400"
            placeholder="Enter your unique code"
          />
          <button type="submit" className="bg-black rounded-lg">
            <span className="block p-4 border-black border-2 -translate-y-1 bg-orange-400 rounded-lg text-white text-xl font-semibold hover:-translate-y-2 transition-all active:translate-x-0 active:translate-y-0">
              {!loading && "Submit"}
              {loading && "Loading..."}
            </span>
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default GetCertificateComponent;
