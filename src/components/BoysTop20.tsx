"use client";
import { getTopParticipants } from "@/actions/dataActions";
import { CrossData } from "@/types/forms";
import React, { useEffect, useState } from "react";
import { PDFDocument, PageSizes, StandardFonts, rgb } from "pdf-lib";

const BoysCrossComponent: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [logoBytes, setLogoBytes] = useState<ArrayBuffer>();

  useEffect(() => {
    const fetchLogo = async () => {
      const logoBuffer = await fetch(
        process.env.NEXT_PUBLIC_PF_URL as string
      ).then((img) => img.arrayBuffer());
      setLogoBytes(logoBuffer);
    };

    fetchLogo();
  }, []);

  function fixTimeFormat(time: Date) {
    const timeZoneOffset = time.getTimezoneOffset();
    const adjustedTime = new Date(time.getTime() + timeZoneOffset * 60 * 1000);

    const month = String(adjustedTime.getMonth() + 1).padStart(2, "0");
    const date = String(adjustedTime.getDate()).padStart(2, "0");

    const formattedDate = `${date}-${month}-${adjustedTime.getFullYear()}`;

    let hours = adjustedTime.getHours();
    const minutes = String(adjustedTime.getMinutes()).padStart(2, "0");
    const seconds = String(adjustedTime.getSeconds()).padStart(2, "0");

    const amPm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const fixedTime = `${formattedDate} ${hours}:${minutes}:${seconds} ${amPm}`;
    return fixedTime;
  }

  async function generatePdf(data: CrossData[], title?: string) {
    const pdfDoc = await PDFDocument.create();
    const helveticaBoldFont = await pdfDoc.embedFont(
      StandardFonts.HelveticaBold
    );
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const page = pdfDoc.addPage(PageSizes.A2);
    const { width, height } = page.getSize();
    const fontSize = 12;
    const margin = 50;
    const tableWidth = width - 2 * margin;
    const rowHeight = 25;
    const cellPadding = 5;

    const pngImage = await pdfDoc.embedPng(logoBytes as ArrayBuffer);
    const pngDims = pngImage.scale(0.015);

    page.drawImage(pngImage, {
      x: width - margin - pngDims.width,
      y: height - margin + 10 - pngDims.height,
      width: pngDims.width,
      height: pngDims.height,
    });

    let y = height - margin * 2;

    const table = {
      x: margin,
      y,
      rows: data.length + 1,
      cols: 5,
      rowHeight,
      cellPadding,
      tableWidth,
      drawHorizontalLine: (x: number, y: number, length: number) => {
        page.drawLine({
          start: { x, y },
          end: { x: x + length, y },
          thickness: 1,
          color: rgb(0, 0, 0),
        });
      },
      drawVerticalLine: (x: number, y: number, length: number) => {
        page.drawLine({
          start: { x, y },
          end: { x, y: y - length },
          thickness: 1,
          color: rgb(0, 0, 0),
        });
      },
      writeText: (text: string, x: number, y: number) => {
        page.drawText(text, {
          x,
          y: y - fontSize + 5,
          size: fontSize,
          color: rgb(0, 0, 0),
        });
      },
    };

    page.setFont(helveticaBoldFont);
    page.drawText(title as string, {
      x: table.x,
      y: table.y,
      color: rgb(0, 0, 0),
      size: 30,
      opacity: 1,
    });
    table.y -= rowHeight + 10;
    table.writeText("Name", table.x + table.cellPadding, table.y);
    table.writeText(
      "Unique Code",
      table.x + table.cellPadding + tableWidth / 5,
      table.y
    );
    table.writeText(
      "Time Crossed",
      table.x + table.cellPadding + (tableWidth * 2) / 5,
      table.y
    );
    table.writeText(
      "Email",
      table.x + table.cellPadding + (tableWidth * 3) / 5,
      table.y
    );
    table.writeText(
      "Mobile",
      table.x + table.cellPadding + (tableWidth * 4) / 5,
      table.y
    );

    table.y -= rowHeight + 10;

    page.setFont(helveticaFont);
    data.forEach((participant, idx) => {
      const formattedTime = fixTimeFormat(participant.timeCrossed);
      table.writeText(participant.name, table.x + table.cellPadding, table.y);
      table.writeText(
        participant.uniqueCode,
        table.x + table.cellPadding + tableWidth / 5,
        table.y
      );
      table.writeText(
        formattedTime,
        table.x + table.cellPadding + (tableWidth * 2) / 5,
        table.y
      );
      table.writeText(
        participant.email || "",
        table.x + table.cellPadding + (tableWidth * 3) / 5,
        table.y
      );
      table.writeText(
        participant.phone || "",
        table.x + table.cellPadding + (tableWidth * 4) / 5,
        table.y
      );

      table.y -= rowHeight;
    });

    for (let i = 0; i < table.rows; ++i) {
      const y = table.y + 8 + table.rowHeight * i;
      table.drawHorizontalLine(table.x, y, table.tableWidth);
    }

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  }

  const handleDownload = async (params: CrossData[]) => {
    const pdfBytes = await generatePdf(params, "Top 20 Participants - Boys");
    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "Top20-Boys.pdf";

    a.click();

    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await getTopParticipants("boys");
    console.log(res);
    await handleDownload(res as CrossData[]);
    setLoading(false);
  };

  return (
    <div className="bg-gray-50 rounded-md shadow-md m-3 sm:w-3/4 md:w-1/2 lg:w-2/5 xl:w-1/3 mx-auto p-4 flex flex-col">
      <h1 className="text-xl font-bold mb-4 text-center">
        Top 20 Participants - Boys
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

export default BoysCrossComponent;
