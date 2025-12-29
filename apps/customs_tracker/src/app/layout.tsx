import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Customs Status Tracker",
    description: "Stop refunding blindly. Check the real status.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="min-h-screen flex flex-col items-center bg-gray-50 text-gray-900">
                    <header className="w-full max-w-5xl p-6 flex justify-between items-center">
                        <h1 className="text-xl font-bold tracking-tight">📦 CustomsTracker</h1>
                    </header>
                    <main className="w-full max-w-5xl p-6 flex-1 flex flex-col items-center justify-center">
                        {children}
                    </main>
                    <footer className="p-6 text-sm text-gray-400">
                        Operational guidance only. Not legal advice.
                    </footer>
                </div>
            </body>
        </html>
    );
}
