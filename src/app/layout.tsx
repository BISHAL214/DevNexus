import Navbar from "@/components/app_components/app_header/app_header_wrapper";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthListener from "./auth_listener";
import { Toaster } from "sonner";
import { IconBrandLinkedin } from "@tabler/icons-react";
import Link from "next/link";
import {MobileDockNavigation} from "@/components/app_components/app_header/app_mobile_dock";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DevNexus - AI-Driven Developer Connections",
  description:
    "Find your perfect dev match with AI-powered skill matching and collaboration tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthListener />
        <Navbar />
        {children}
          <MobileDockNavigation />
        <footer className="h-[50px] text-white bg-black hidden md:flex flex-shrink-0 gap-5 items-center justify-center text-center">
          Created with ❤️ by Bishal Mondal
          <Link
            className="z-50"
            href={"https://www.linkedin.com/in/bishal-mondal-1521aa21b/"}
            target="_blank"
          >
            <IconBrandLinkedin />
          </Link>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
