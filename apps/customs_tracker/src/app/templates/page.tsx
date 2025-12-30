import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare } from "lucide-react";
import { carriers } from "@/data/carriers";

export const metadata = {
    title: "Claim Templates | Customs Tracker",
    description: "Free copy-paste email and Telegram templates for lost package claims.",
};

export default function TemplatesPage() {
    return (
        <div className="min-h-screen py-20 px-4 flex flex-col items-center">
            <div className="w-full max-w-5xl mb-8">
                <Link href="/" className="text-slate-400 hover:text-white flex items-center gap-2 mb-8 text-sm transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Tracker
                </Link>
            </div>

            <div className="w-full max-w-5xl text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-black mb-4 text-white">
                    Free Claim Templates
                </h1>
                <p className="text-slate-400 max-w-xl mx-auto">
                    Don't write from scratch. Use our lawyer-approved templates to demand refunds or locate missing international parcels.
                </p>
            </div>

            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(carriers).map(([slug, carrier]) => (
                    <Link key={slug} href={`/carriers/${slug}`} className="group">
                        <div className="bg-slate-800/40 border border-white/5 p-6 rounded-2xl hover:bg-slate-800/60 transition-all hover:scale-[1.02]">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-white">{carrier.fullName}</h3>
                                <span className="p-2 bg-white/5 rounded-lg text-slate-400 group-hover:text-blue-400 transition-colors">
                                    →
                                </span>
                            </div>

                            <div className="flex gap-3 text-sm text-slate-400">
                                <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/50 rounded-full">
                                    <Mail className="w-3 h-3" /> Email
                                </div>
                                {carrier.telegram && (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full">
                                        <MessageSquare className="w-3 h-3" /> Telegram
                                    </div>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
