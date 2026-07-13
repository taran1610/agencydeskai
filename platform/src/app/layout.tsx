import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { FileSearch } from "lucide-react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgencyDesk AI — Operations Console",
  description:
    "AI operations teammate for insurance agencies: document intake, extraction, flags, and CRM prep with human approval.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 text-white">
                <FileSearch size={15} strokeWidth={2} />
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-slate-900">
                AgencyDesk AI
              </span>
              <span className="ml-1 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] font-medium text-slate-500">
                Operations Console
              </span>
            </Link>
            <span className="text-xs text-slate-400">
              Human approval required before anything leaves this console
            </span>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
