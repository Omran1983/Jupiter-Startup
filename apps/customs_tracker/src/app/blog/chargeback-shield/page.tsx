"use client";
import Link from "next/link";
import { ArrowLeft, Share2 } from "lucide-react";

export const metadata = {
    title: "How to Win INR Disputes | Customs Tracker",
    description: "Item Not Received disputes kill dropshipping businesses. Learn how to use Chain of Custody evidence to win PayPal and Stripe chargebacks.",
};

export default function ChargebackShieldPost() {
    return (
        <div className="w-full min-h-screen bg-white">
            {/* Nav */}
            <div className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/blog" className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Intelligence
                    </Link>
                    <button
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                        aria-label="Share article"
                        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent("How to Win 'Item Not Received' Disputes with Better Evidence")}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`, '_blank')}
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <article className="max-w-3xl mx-auto px-4 py-12">
                <header className="mb-12 text-center">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold tracking-wide uppercase mb-4">
                        Financial Protection
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                        How to Win "Item Not Received" Disputes with Better Evidence
                    </h1>
                </header>

                <div className="prose prose-lg prose-blue mx-auto text-gray-700">
                    <h3>The Problem</h3>
                    <p>
                        PayPal and Stripe engage in "Auto-Refunds" if you cannot prove delivery within a certain window.
                        A screenshot of "In Transit" is often not enough to win an Item Not Received (INR) dispute, especially if the last update was 10 days ago.
                    </p>

                    <h3>The Fix: Official Chain of Custody</h3>
                    <p>
                        Arbitration is legal theater. The side with the most "official" looking document wins.
                        Customs Tracker generates a legally-formatted PDF report designed for this exact purpose:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Header:</strong> "Official Chain of Custody Report" (Sounds authoritative)</li>
                        <li><strong>Data:</strong> Shows the precise location, estimated customs hold time, and the "Next Action" date.</li>
                        <li><strong>Authority:</strong> Uses industry-standard codes (HS Codes) to explain <em>why</em> it is delayed (e.g., "Routine Silk Road Inspection").</li>
                    </ul>

                    <h3>The Strategy</h3>
                    <p>When a customer threatens a dispute:</p>
                    <ol className="list-decimal pl-5 space-y-4">
                        <li>Run the tracking number on <strong>Customs Tracker</strong>.</li>
                        <li>Download the <strong>Official Evidence PDF</strong>.</li>
                        <li>Upload it to the PayPal Resolution Center.</li>
                        <li>Email it to the customer with this script:</li>
                    </ol>

                    <div className="my-8 p-6 bg-gray-100 rounded-xl font-mono text-sm text-gray-800">
                        "Good news, your package isn't lost. It's currently in a Routine Customs Scan (Level 1). <br /><br />
                        Here is the official Chain of Custody report attached. <br />
                        Authority expects release within 48 hours."
                    </div>
                </div>

                <div className="mt-16 p-8 bg-blue-600 rounded-3xl text-center text-white shadow-2xl">
                    <h3 className="text-2xl font-bold mb-4">Generate Your Evidence Now</h3>
                    <p className="text-blue-100 mb-8 max-w-lg mx-auto">
                        Don't let a generic "In Transit" screenshot cost you $50. Get the PDF.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-700 font-bold rounded-xl transition-all shadow-lg hover:bg-blue-50 hover:-translate-y-1"
                    >
                        Create PDF Report
                    </Link>
                </div>
            </article>
        </div>
    );
}
