import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Indie_Flower,
  Finger_Paint,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const indieFlower = Indie_Flower({
  variable: "--font-indie-flower",
  subsets: ["latin"],
  weight: "400", // Indie Flower only has 400 available
});

const fingerPaint = Finger_Paint({
  variable: "--font-finger-paint",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "DoodleArt",
  description: "Online real-time canvas app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${indieFlower.variable} ${fingerPaint.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
