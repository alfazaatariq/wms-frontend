import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import QueryWrapper from "@/components/query-wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "WMS Dashboard",
  description: "Warehouse Management System Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <QueryWrapper>{children}</QueryWrapper>
        </div>
      </body>
    </html>
  );
}
