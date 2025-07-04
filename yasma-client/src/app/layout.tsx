import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PT_Sans, PT_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ptSans = PT_Sans({
  weight: ["400", "700"],
  variable: "--font-pt-sans",
  subsets: ["latin"],
});

const ptMono = PT_Mono({
  weight: ["400"],
  variable: "--font-pt-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Yasma!",
  description: "Generated by Chris Kuhar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ptSans.variable} ${ptMono.variable} antialiased text-gray-800`}
      >
      {children}
      </body>
    </html>
  );
}
