import type { Metadata } from "next";
import { PT_Sans, PT_Mono } from "next/font/google";
import "../globals.css";

const ptSans = PT_Sans({
  weight: ["400", "700"],
  variable: "--font-pt-sans",
  subsets: ["latin"],
});

const ptMono = PT_Mono({
  weight: ["400"],
  variable: "--font-pt-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <>
        {children}
      </>
  );
}
