"use client";
import Link from "next/link";
import { ArrowLeft, Share2, AlertTriangle } from "lucide-react";

export const metadata = {
    title: "HS Code Risk Scores | Customs Tracker",
    description: "Understand why specific products get held in customs longer than others based on Harmonized System codes.",
};

export default function RiskScoresPost() {
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
                        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent("Does Your HS Code Flag You for Inspection?")}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`, '_blank')}
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <article className="max-w-3xl mx-auto px-4 py-12">
                <header className="mb-12 text-center">
                    <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold tracking-wide uppercase mb-4">
                        Technical Deep Drive
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                        Does Your HS Code Flag You for Inspection?
                    </h1>
                </header>

                <div className="prose prose-lg prose-red mx-auto text-gray-700">
                    <h3>Why some packages rot in customs</h3>
                    <p>
                        It's not random. Customs AI targets specific Harmonized System (HS) codes.
                        If you are shipping generic "Gift" labels, you are actually INCREASING your risk profile.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
                        <div className="p-4 border border-gray-200 rounded-lg">
                            <h4 className="font-bold text-gray-900 mt-0">Electronics (85xx)</h4>
                            <p className="text-sm mb-0">High risk of batteries/IP theft. <br /><span className="text-red-600 font-bold">Risk: High</span></p>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg">
                            <h4 className="font-bold text-gray-900 mt-0">Textiles (61xx)</h4>
                            <p className="text-sm mb-0">High risk of undervaluation. <br /><span className="text-amber-600 font-bold">Risk: Moderate</span></p>
                        </div>
                    </div>

                    <h3>Know Your Risk Score</h3>
                    <p>
                        Customs Tracker assigns a "Risk Score" (0-100) to your shipment based on its origin and carrier pattern.
                    </p>
                    <ul className="list-none space-y-4 pl-0">
                        <li className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <div><strong>Score &lt; 20:</strong> "Green Lane" (Standard processing).</div>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                            <div><strong>Score &gt; 50:</strong> "Yellow Lane" (Likely documentation check).</div>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-red-600"></div>
                            <div><strong>Score &gt; 80:</strong> "Red Lane" (Physical Inspection guaranteed).</div>
                        </li>
                    </ul>

                    <p>
                        Knowing this score lets you warn customers <em>in advance</em>. "Heads up, due to strict safety checks on this item type, customs may hold it for an extra 3 days." Honesty reduces refund requests by 40%.
                    </p>
                </div>

                <div className="mt-16 p-8 border-2 border-dashed border-gray-300 rounded-3xl text-center">
                    <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Check Your HS Code Risk</h3>
                    <p className="text-gray-500 mb-6">
                        See exactly what the Customs Inspector sees.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-8 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-black transition-colors"
                    >
                        Calculate Risk Score
                    </Link>
                </div>
            </article>
        </div>
    );
}
