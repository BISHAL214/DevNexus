import { IconBrandLinkedin } from "@tabler/icons-react";
import {
  Geist as GeistFont,
  Geist_Mono as GeistMonoFont,
} from "next/font/google";
import Link from "next/link";
import { ClientLayout } from "./client_layout";
import "./globals.css";

const geistSans = GeistFont({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = GeistMonoFont({
  subsets: ["latin"],
  variable: "--font-geist-mono",
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
        <ClientLayout>{children}</ClientLayout>
        <footer className="h-[50px] text-white bg-black hidden md:flex flex-shrink-0 gap-5 items-center justify-center text-center">
          Created with ❤️ by Bishal Mondal
          <Link
            className="z-50"
            href="https://www.linkedin.com/in/bishal-mondal-1521aa21b/"
            target="_blank"
          >
            <IconBrandLinkedin />
          </Link>
        </footer>
      </body>
    </html>
  );
}
