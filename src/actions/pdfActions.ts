import { PDFDocument, PageSizes, rgb, PDFFont, StandardFonts } from "pdf-lib";

type CrossData = {
  email: string;
  name: string;
  phone: string;
  timeCrossed: string;
  uniqueCode: string;
};

export async function generatePdf(data: CrossData[], title?: string) {
  const pdfDoc = await PDFDocument.create();
  const timesRomanBoldFont = await pdfDoc.embedFont(
    StandardFonts.HelveticaBold
  );
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

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

  page.setFont(timesRomanBoldFont);
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

  page.setFont(timesRomanFont);
  data.forEach((participant, idx) => {
    table.writeText(participant.name, table.x + table.cellPadding, table.y);
    table.writeText(
      participant.uniqueCode,
      table.x + table.cellPadding + tableWidth / 5,
      table.y
    );
    table.writeText(
      participant.timeCrossed,
      table.x + table.cellPadding + (tableWidth * 2) / 5,
      table.y
    );
    table.writeText(
      participant.email,
      table.x + table.cellPadding + (tableWidth * 3) / 5,
      table.y
    );
    table.writeText(
      participant.phone,
      table.x + table.cellPadding + (tableWidth * 4) / 5,
      table.y
    );

    table.y -= rowHeight;
  });

  for (let i = 0; i < table.rows; ++i) {
    const y = table.y + 8 + table.rowHeight * i;
    table.drawHorizontalLine(table.x, y, table.tableWidth);
    console.log(y);
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
