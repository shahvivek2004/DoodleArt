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
  title: {
    default: "DoodleArt - Free Online Whiteboard & Canvas App",
    template: "%s | DoodleArt", // For child pages: "About | DoodleArt"
  },
  description:
    "Create stunning digital art with DoodleArt - a free, real-time online canvas and whiteboard app. Open-source drawing tool with cloud backup, collaborative features, and seamless creative experience. Perfect for artists, designers, and teams.",
  keywords: [
    "online whiteboard",
    "digital canvas",
    "free drawing app",
    "collaborative whiteboard",
    "online drawing tool",
    "cloud canvas",
    "real-time whiteboard",
    "open source canvas",
    "digital art app",
    "sketch app online",
    "team whiteboard",
    "drawing board online",
    "creative canvas",
    "art collaboration tool",
  ],

  authors: [
    {
      name: "Vivek Shah",
      url: "https://doodleart.live",
    },
  ],

  creator: "DoodleArt",
  publisher: "DoodleArt",
  category: "Technology",

  alternates: {
    canonical: "https://doodleart.live",
    languages: {
      "en-US": "https://doodleart.live",
    },
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://doodleart.live", // Replace with your actual URL
    title: "DoodleArt - Free Online Whiteboard & Canvas App",
    description:
      "Create stunning digital art with DoodleArt. Free, real-time collaborative canvas with cloud backup. Perfect for artists, designers, and creative teams.",
    siteName: "DoodleArt",
    images: [
      {
        url: "https://doodleart.live/og-image.png", // Replace with your actual image
        width: 1200,
        height: 630,
        alt: "DoodleArt - Online Canvas and Whiteboard App",
        type: "image/png",
      },
      {
        url: "https://doodleart.live/og-image-square.png", // Optional square version
        width: 1200,
        height: 1200,
        alt: "DoodleArt Logo",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "DoodleArt - Free Online Whiteboard & Canvas App",
    description:
      "Create stunning digital art with real-time collaboration and cloud backup. Free and open-source.",
    site: "@VivekShah392325",
    creator: "@VivekShah392325",
    images: ["https://doodleart.live/og-image.png"], // Replace with your actual image
  },

  icons: {
    icon: [
      { url: "https://doodleart.live/favicon.ico" },
      {
        url: "https://doodleart.live/icon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "https://doodleart.live/icon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "https://doodleart.live/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
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
