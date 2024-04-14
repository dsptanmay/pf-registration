import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

export const primary_transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.NEXT_PUBLIC_PRI_GMAIL_ID as string,
    pass: process.env.NEXT_PUBLIC_PRI_GMAIL_PWD as string,
  },
});

export const girls_transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.NEXT_PUBLIC_GIRLS_GMAIL_ID as string,
    pass: process.env.NEXT_PUBLIC_GIRLS_GMAIL_PWD as string,
  },
});

export const walkathon_transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.NEXT_PUBLIC_WALKATHON_GMAIL_ID as string,
    pass: process.env.NEXT_PUBLIC_WALKATHON_GMAIL_PWD as string,
  },
});

export function getCertMailOpts(
  name: string,
  email: string,
  pdfContent: Buffer,
  category: "boys" | "girls" | "walkathon"
) {
  const opts: Mail.Options = {
    to: email,
    subject: "Certificate of Participation - Marathon 15.0",
    text: `Dear ${name}, \n\nThank you for taking part in our event!\n\nPlease find attached a copy of your participation certificate.\n\nBest Regards,\n\nTeam Pathfinder`,
    attachments: [
      {
        filename: "certificate.pdf",
        content: pdfContent,
      },
    ],
  };
  if (category === "boys")
    opts.from = process.env.NEXT_PUBLIC_PRI_GMAIL_ID as string;
  else if (category === "girls")
    opts.from = process.env.NEXT_PUBLIC_GIRLS_GMAIL_ID as string;
  else if (category === "walkathon")
    opts.from = process.env.NEXT_PUBLIC_WALKATHON_GMAIL_ID as string;

  return opts;
}

export function getQRMailOpts(name: string, email: string, qrContent: string) {
  const opts: Mail.Options = {
    from: process.env.NEXT_PUBLIC_PRI_GMAIL_ID,
    to: email,
    subject: "Thank You for Participating!",
    html: `
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  border: 1px solid #ccc;
                  border-radius: 5px;
                }
                .header {
                  text-align: center;
                  margin-bottom: 20px;
                }
                .header h2 {
                  color: #007bff;
                }
                .message {
                  margin-bottom: 20px;
                }
                .footer {
                  text-align: center;
                  margin-top: 20px;
                  color: #666;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>Thank You for Participating!</h2>
                </div>
                <div class="message">
                  <p>Hello ${name},</p>
                  <p>Thank you for participating in our event! We appreciate your contribution.</p>
                  <p>As a proof of your participation, please find your QR Code attached to this email.</p>
                </div>
                <div class="footer">
                  <p>Best Regards,</p>
                  <p>Pathfinder</p>
                </div>
              </div>
            </body>
          </html>
        `,
    attachments: [
      {
        filename: "qrCode.png",
        content: qrContent.split(";base64,").pop(),
        encoding: "base64",
      },
    ],
  };
  return opts;
}

export default async function sendMailSimplified(
  transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>,
  mailOpts: Mail.Options
) {
  await transporter.sendMail(mailOpts);
}
