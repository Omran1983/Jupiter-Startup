import { carriers } from "@/data/carriers";
import { Mail, Copy, ArrowLeft, Phone } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CarrierPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const carrier = carriers[params.slug as keyof typeof carriers];

    if (!carrier) {
        notFound();
    }

    return (
        <div className="w-full max-w-2xl px-4 py-8">
            <Link href="/" className="text-slate-400 hover:text-white flex items-center gap-2 mb-8 text-sm transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Tracker
            </Link>

            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{carrier.fullName}</h1>
                        <p className="text-slate-400">Official Claim & Contact Templates</p>
                    </div>
                </div>

                {/* --- TEMPLATE BOX --- */}
                <div className="bg-slate-900/80 rounded-xl p-6 border border-slate-700 mb-8 font-mono text-sm shadow-inner relative group">
                    <p className="text-slate-500 mb-2 border-b border-slate-800 pb-2">EMAIL TEMPLATE</p>
                    <div className="text-slate-300 whitespace-pre-wrap">{carrier.template.replace("#{TRACKING}", "[YOUR_TRACKING_NUMBER]")}</div>

                    {/* Copy Button Hint */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs bg-slate-700 text-white px-2 py-1 rounded">Copy Text</span>
                    </div>
                </div>

                {/* --- ACTIONS --- */}
                <div className="grid gap-4 md:grid-cols-2">
                    <a
                        href={`mailto:${carrier.email}?body=${encodeURIComponent(carrier.template)}`}
                        className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-900/20"
                    >
                        <Mail className="w-5 h-5" />
                        Open Email Client
                    </a>

                    {carrier.telegram ? (
                        <a
                            href={carrier.telegram}
                            target="_blank"
                            className="flex items-center justify-center gap-3 bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold py-4 rounded-xl transition-all shadow-lg"
                        >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
                            Open Telegram
                        </a>
                    ) : (
                        <button disabled className="flex items-center justify-center gap-3 bg-slate-700 text-slate-500 font-bold py-4 rounded-xl cursor-not-allowed border border-slate-600">
                            Telegram Unavailable
                        </button>
                    )}
                </div>

                <div className="mt-8 pt-8 border-t border-slate-700/50 flex flex-col gap-2 text-center text-sm text-slate-400">
                    <p>Support Email: <span className="text-white select-all">{carrier.email}</span></p>
                    <p>Phone: <span className="text-white select-all">{carrier.phone}</span></p>
                </div>
            </div>
        </div>
    );
}
