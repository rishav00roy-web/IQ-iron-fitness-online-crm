import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "CRM | Gym Management",
  description: "Premium Member Management System",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,        // Allow pinch-zoom for accessibility
  userScalable: true,
  viewportFit: "cover",  // Required for env(safe-area-inset-*) on iOS notch devices
  themeColor: "#0a0d15",
  colorScheme: "dark",   // Tells iOS Safari all form controls should render in dark mode
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
