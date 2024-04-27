"use server";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { getCertMailOpts, primary_transporter } from "@/actions/mailActions";

export async function generateCertificate(
  participantName: string
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([3508, 2456]);

  const font = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  page.setFont(font);
  const imgBytes = await fetch(
    "https://i.postimg.cc/WbsKdgG1/participate-1.png"
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

  primary_transporter.sendMail(mailOpts);
}
