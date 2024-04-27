import { PDFDocument, PageSizes, rgb, StandardFonts, PDFPage } from "pdf-lib";
import { CrossData, SITData } from "@/types/forms";

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

export async function generateSITPDF(data: SITData[][]) {
  const pdfDoc = await PDFDocument.create();
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
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

export async function generatePdf(data: CrossData[], title?: string) {
  const pdfDoc = await PDFDocument.create();
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const page = pdfDoc.addPage(PageSizes.A2);
  const { width, height } = page.getSize();
  const fontSize = 12;
  const margin = 50;
  const tableWidth = width - 2 * margin;
  const rowHeight = 25;
  const cellPadding = 5;

  const logoUrl = "https://i.postimg.cc/x8Jwt2dT/pf-logo-vector-5k.png";
  const logoBytes = await fetch(logoUrl).then((img) => img.arrayBuffer());

  const pngImage = await pdfDoc.embedPng(logoBytes);
  const pngDims = pngImage.scale(0.1);

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
