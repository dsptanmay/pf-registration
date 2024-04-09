import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport(
    {
        service: "Gmail",
        auth: {
            user: process.env.GMAIL_ID as string,
            pass: process.env.GMAIL_PWD as string
        }
    }
)

export function getMailOpts(name: string, email: string, path: string)
{
    const opts = {
        from: 'pfmarathon15.0@gmail.com',
        to: email,
        subject: 'Thank You for Participating!',
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
                filename: 'qrCode.png',
                path: path
            }
        ]
    };
    return opts;
}