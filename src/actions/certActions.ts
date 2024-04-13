"use server";

import { PDFDocument, rgb } from "pdf-lib";

export async function generateCertificate(
  participantName: string,
  participantImage: string
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([3508, 2456]);

  const font = await pdfDoc.embedFont("Times-BoldItalic");
  const textWidth = font.widthOfTextAtSize(participantName, 100);

  const pngImage = await pdfDoc.embedPng(
    Buffer.from(participantImage, "base64")
  );

  page.drawImage(pngImage, {
    x: 0,
    y: 0,
    height: 2456,
    width: 3508,
  });

  page.drawText(participantName, {
    x: (page.getWidth() - textWidth) / 2,
    y: 1415,
    size: 100,
    color: rgb(0, 0, 0),
    font,
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
