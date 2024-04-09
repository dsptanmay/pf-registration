import type { Metadata } from "next";
import { Inter as fontSans } from "next/font/google";
import "./globals.css";

const inter = fontSans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Marathon Registrations",
  description: "Created by Pathfinder Volunteers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
