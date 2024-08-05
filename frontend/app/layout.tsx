"use client"
import "./globals.css";
import type { Metadata } from "next";
import { usePathname } from 'next/navigation';
import { Inter } from "next/font/google";
import NavbarSimple from "@/components/navbar";
import Footer from "@/components/footer/index";

const inter = Inter({ subsets: ["vietnamese"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="border-b border-1 shadow-sm mb-5 md:mb-0">
          <NavbarSimple />
        </div>

        <div className="z-2">{children}</div>

        {(pathname != '/login' && pathname != '/regis') &&
          (<Footer />)}
      </body>
    </html>
  );
}
