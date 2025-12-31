import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { FeedbackWidget } from "@/components/FeedbackWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Customs Status Tracker",
    description: "Stop refunding blindly. Check the real status.",
};

import Header from "@/components/Header";

import CarrierSideBar from "@/components/CarrierSideBar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="min-h-screen flex flex-col items-center bg-slate-950 text-slate-200 overflow-x-hidden selection:bg-blue-500/30">
                    <Header />
                    <CarrierSideBar />
                    <main className="w-full max-w-5xl p-6 flex-1 flex flex-col items-center justify-center">
                        {children}
                    </main>
                    <footer className="p-8 text-center border-t border-slate-800 w-full mt-8 bg-slate-900/50 backdrop-blur-sm">
                        <div className="flex flex-col gap-2 text-sm text-slate-500">
                            <p className="font-semibold cursor-help hover:text-slate-300 transition-colors" title="Registered in Republic of Mauritius">Operated by A-One Global Resourcing Ltd</p>
                            <p className="text-xs opacity-60">BRN: C22185206 | TAN: 28006142</p>
                            <p className="text-xs opacity-60 hover:text-blue-400 transition-colors">deals@aogrl.com | +230 5788 7132</p>
                            <p className="text-[10px] text-slate-600 mt-4 uppercase tracking-wider">
                                Operational guidance only. Not legal advice.
                            </p>
                        </div>
                    </footer>
                </div>
                <FeedbackWidget />
                <Analytics />
            </body>
        </html>
    );
}
