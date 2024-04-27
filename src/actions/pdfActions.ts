import { PDFDocument, PageSizes, rgb, StandardFonts } from "pdf-lib";
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

export async function generateSITPDF(data: SITData[]) {
  const pdfDoc = await PDFDocument.create();
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const page = pdfDoc.addPage(PageSizes.A2);
  const { width, height } = page.getSize();
  const fontSize = 12;
  const margin = 50;
  const tableWidth = width - 2 * margin;

  let y = height - margin;

  const rowHeight = 25;
  const cellPadding = 5;

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
  page.drawText("SIT Participants", {
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
    "USN",
    table.x + table.cellPadding + (tableWidth * 2) / 5,
    table.y
  );
  table.writeText(
    "Email Address",
    table.x + table.cellPadding + (tableWidth * 3) / 5,
    table.y
  );
  table.writeText(
    "Mobile Number",
    table.x + table.cellPadding + (tableWidth * 4) / 5,
    table.y
  );

  table.y -= rowHeight + 10;
  page.setFont(helveticaFont);

  data.forEach((participant) => {
    table.writeText(participant.name, table.x + table.cellPadding, table.y);
    table.writeText(
      participant.uniqueCode,
      table.x + table.cellPadding + tableWidth / 5,
      table.y
    );
    table.writeText(
      participant.usn,
      table.x + table.cellPadding + (tableWidth * 2) / 5,
      table.y
    );
    table.writeText(
      participant.email as string,
      table.x + table.cellPadding + (tableWidth * 3) / 5,
      table.y
    );
    table.writeText(
      participant.phone as string,
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

export async function generatePdf(data: CrossData[], title?: string) {
  const pdfDoc = await PDFDocument.create();
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const page = pdfDoc.addPage(PageSizes.A2);
  const { width, height } = page.getSize();
  const fontSize = 12;
  const margin = 50;
  const tableWidth = width - 2 * margin;
  let y = height - margin;
  const rowHeight = 25;
  const cellPadding = 5;

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
