"use client";
import { getSITParticipants } from "@/actions/dataActions";
import { SITData } from "@/types/forms";
import { PDFDocument, PDFPage, PageSizes, StandardFonts, rgb } from "pdf-lib";
import React, { useState } from "react";

const SITParticipants = () => {
  const [loading, setLoading] = useState<boolean>(false);

  async function generateSITPDF(data: SITData[][]) {
    const pdfDoc = await PDFDocument.create();
    const helveticaBoldFont = await pdfDoc.embedFont(
      StandardFonts.HelveticaBold
    );
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pageWidth = PageSizes.A2[0];
    const pageHeight = PageSizes.A2[1];

    const fontSize = 12;
    const margin = 50;
    const rowHeight = 25;
    const cellPadding = 5;

    const table = {
      rows: 0,
      cols: 5,
      rowHeight,
      cellPadding,

      drawHorizontalLine: (
        page: PDFPage,
        x: number,
        y: number,
        length: number
      ) => {
        page.drawLine({
          start: { x, y },
          end: { x: x + length, y },
          thickness: 1,
          color: rgb(0, 0, 0),
        });
      },

      writeText: (page: PDFPage, text: string, x: number, y: number) => {
        page.drawText(text, {
          x,
          y: y - fontSize + 5,
          size: fontSize,
          color: rgb(0, 0, 0),
        });
      },
    };

    for (const chunk of data) {
      const page = pdfDoc.addPage([pageWidth, pageHeight]);
      let y = pageHeight - margin;
      const tableWidth = pageWidth - 2 * margin;

      table.rows = Math.min(chunk.length, 57) + 1;

      page.setFont(helveticaBoldFont);

      page.drawText("SIT Participants", {
        x: margin,
        y,
        color: rgb(0, 0, 0),
        size: 30,
        opacity: 1,
      });

      y -= rowHeight + 10;
      table.writeText(page, "Name", margin + table.cellPadding, y);
      table.writeText(
        page,
        "Unique Code",
        margin + table.cellPadding + tableWidth / 5,
        y
      );
      table.writeText(
        page,
        "USN",
        margin + table.cellPadding + (tableWidth * 2) / 5,
        y
      );
      table.writeText(
        page,
        "Email Address",
        margin + table.cellPadding + (tableWidth * 3) / 5,
        y
      );
      table.writeText(
        page,
        "Mobile Number",
        margin + table.cellPadding + (tableWidth * 4) / 5,
        y
      );

      y -= rowHeight + 10;
      page.setFont(helveticaFont);

      for (const participant of chunk) {
        table.writeText(page, participant.name, margin + table.cellPadding, y);
        table.writeText(
          page,
          participant.uniqueCode,
          margin + table.cellPadding + tableWidth / 5,
          y
        );
        table.writeText(
          page,
          participant.usn,
          margin + table.cellPadding + (tableWidth * 2) / 5,
          y
        );
        table.writeText(
          page,
          participant.email,
          margin + table.cellPadding + (tableWidth * 3) / 5,
          y
        );
        table.writeText(
          page,
          participant.phone,
          margin + table.cellPadding + (tableWidth * 4) / 5,
          y
        );

        y -= rowHeight;
      }

      for (let i = 0; i < table.rows; ++i) {
        const lineY = y + 8 + table.rowHeight * i;
        table.drawHorizontalLine(page, margin, lineY, tableWidth);
      }
    }

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  }
  const toChunks = (data: SITData[], chunkSize: number) => {
    const chunks: SITData[][] = [];
    for (let i = 0; i < data.length; i += chunkSize)
      chunks.push(data.slice(i, i + chunkSize));
    return chunks;
  };

  const handleDownload = async (params: SITData[]) => {
    const data = toChunks(params, 57);
    const pdfBytes = await generateSITPDF(data);
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
