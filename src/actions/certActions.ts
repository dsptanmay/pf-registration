"use server";

import { PDFDocument, rgb } from "pdf-lib";
import { getCertMailOpts, primary_transporter } from "@/actions/mailActions";

export async function generateCertificate(
  participantName: string
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([3508, 2456]);

  const font = await pdfDoc.embedFont("Times-BoldItalic");
  const imgBytes = await fetch(
    "https://i.postimg.cc/qq98pptL/participate.png"
  ).then((img) => img.arrayBuffer());
  const textWidth = font.widthOfTextAtSize(participantName, 100);

  const pngImage = await pdfDoc.embedPng(imgBytes);

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

export async function sendCertificateEmail(
  participantName: string,
  participantEmail: string
) {
  const pdfContent = await generateCertificate(participantName);
  const mailOpts = getCertMailOpts(
    participantName,
    participantEmail,
    pdfContent,
    "boys"
  );

  await primary_transporter.sendMail(mailOpts);
}
