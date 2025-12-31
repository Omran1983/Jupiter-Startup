import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import Header from "@/components/Header";

type Props = {
    params: { courier: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const courier = params.courier.replace("-", " ").toUpperCase();
    return {
        title: `Track ${courier} Packages | Real-Time Status & Delays`,
        description: `Check the real status of your ${courier} shipments. Detect stuck packages, customs hold-ups, and get refund evidence for ${courier} delays.`,
    };
}

export default function CourierLandingPage({ params }: Props) {
    const courierName = params.courier.replace(/-/g, " ").toUpperCase();

    return (
        <div className="w-full flex flex-col min-h-screen bg-[#020617] text-slate-200">
            <Header />

            <main className="flex-grow pt-32 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Global Tracker
                    </Link>

                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase">
                        Track <span className="text-blue-500">{courierName}</span>
                    </h1>

                    <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                        Is {courierName} delaying your dropshipping orders? <br />
                        Don't accept "In Transit" as an answer.
                    </p>

                    <div className="p-10 bg-slate-900/50 border border-blue-500/30 rounded-2xl shadow-2xl backdrop-blur-sm">
                        <h2 className="text-2xl font-bold text-white mb-8">
                            Enter {courierName} Tracking Number
                        </h2>

                        {/* Fake Input that redirects to Home for actual logic (Simpler for now) */}
                        <div className="flex flex-col gap-4 max-w-lg mx-auto">
                            <input
                                type="text"
                                placeholder={`e.g. ${courierName}123456789`}
                                className="w-full p-4 text-lg bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <Link href="/?focus=tracking" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/25">
                                Analyze {courierName} Status
                            </Link>
                        </div>
                    </div>

                    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        <div className="p-6 bg-slate-900/30 rounded-xl border border-white/5">
                            <h3 className="text-lg font-bold text-white mb-2">🐢 Detect {courierName} Delays</h3>
                            <p className="text-sm text-slate-500">We analyze millions of {courierName} shipments to tell you if your package is actually stuck.</p>
                        </div>
                        <div className="p-6 bg-slate-900/30 rounded-xl border border-white/5">
                            <h3 className="text-lg font-bold text-white mb-2">📜 Get Refund Evidence</h3>
                            <p className="text-sm text-slate-500">If {courierName} lost it, we generate the PDF proof you need to win the dispute.</p>
                        </div>
                        <div className="p-6 bg-slate-900/30 rounded-xl border border-white/5">
                            <h3 className="text-lg font-bold text-white mb-2">🔎 Deep Scan</h3>
                            <p className="text-sm text-slate-500">We check alternative carrier networks (Last Mile) that {courierName} might not show you.</p>
                        </div>
                    </div>

                    <div className="mt-20">
                        <Link href="/carriers" className="text-slate-500 hover:text-blue-400 underline decoration-dotted underline-offset-4">
                            View all 80+ Supported Carriers
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
