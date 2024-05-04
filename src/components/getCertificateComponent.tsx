"use client";

import { getOneParticipant } from "@/actions/dataActions";
import { toastOpts } from "@/utils/freq";
import { zodResolver } from "@hookform/resolvers/zod";
import { PDFDocument, PDFImage, StandardFonts, rgb } from "pdf-lib";
import React, { useEffect, useState } from "react";
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
  const [certificateBytes, setPartCertBytes] = useState<ArrayBuffer>();
  const [walkathonBytes, setWalkathonBytes] = useState<ArrayBuffer>();

  useEffect(() => {
    const fetchCertificate = async () => {
      const certBuffer = await fetch(
        process.env.NEXT_PUBLIC_CERT_URL as string
      ).then((img) => img.arrayBuffer());
      setPartCertBytes(certBuffer);

      const walkBuffer = await fetch(
        process.env.NEXT_PUBLIC_WALK_URL as string
      ).then((img) => img.arrayBuffer());

      setWalkathonBytes(walkBuffer);
    };
    fetchCertificate();
  }, []);

  async function generateCertificatePDF(
    participantName: string,
    category: string
  ) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([3508, 2456]);

    const font = await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic);
    const fontSize = 100;
    page.setFont(font);

    const textWidth = font.widthOfTextAtSize(participantName, fontSize);
    const { width } = page.getSize();

    let certImage: PDFImage;
    certImage = await pdfDoc.embedPng(certificateBytes as ArrayBuffer);
    if (category === "w")
      certImage = await pdfDoc.embedPng(walkathonBytes as ArrayBuffer);

    page.drawImage(certImage, {
      x: 0,
      y: 0,
      height: 2456,
      width: 3508,
    });

    page.drawText(participantName, {
      x: (width - textWidth) / 2,
      y: 1445,
      size: fontSize,
      color: rgb(0, 0, 0),
      font,
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  }

  const onSubmit = async (event: formData) => {
    setLoading(true);
    const res = await getOneParticipant(event.unique_code);
    if (res.length === 0) {
      toast.error("Participant not found!", toastOpts);
    } else {
      try {
        toast.success("Certificate Downloading...", toastOpts);
        const name = res[0].name.trim();
        const cat = res[0].category.trim();

        const pdfBytes = await generateCertificatePDF(name, cat);

        const blob = new Blob([pdfBytes], { type: "application/pdf" });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = `CertificateOfParticipation-${name}.pdf`;

        a.click();

        window.URL.revokeObjectURL(url);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
  };
  return (
    <div className="h-screen bg-gradient-to-br from-orange-400 to-purple-400 flex items-center justify-center">
      <div className="bg-white p-10 rounded-lg drop-shadow-lg w-auto h-1/2 flex flex-col justify-center items-center gap-4 m-5">
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
