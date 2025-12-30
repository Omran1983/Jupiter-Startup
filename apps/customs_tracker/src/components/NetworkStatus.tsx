import { Server, AlertTriangle, CheckCircle, Activity, Anchor } from "lucide-react";

export default function NetworkStatus() {
    return (
        <section className="w-full max-w-5xl mx-auto px-4 py-12">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    Live Network Operations Center (NOC)
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* STATUS CARD 1: OVERALL HEALTH */}
                <div className="bg-slate-900/50 border border-slate-700/50 p-4 rounded-xl flex items-center justify-between shadow-lg backdrop-blur-sm">
                    <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Global Throughput</p>
                        <p className="text-2xl font-mono text-green-400 font-bold">98.2%</p>
                    </div>
                    <Server className="w-6 h-6 text-slate-600" />
                </div>

                {/* STATUS CARD 2: PORT CONGESTION */}
                <div className="bg-slate-900/50 border border-slate-700/50 p-4 rounded-xl flex items-center justify-between shadow-lg backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>
                    <div className="relative z-10">
                        <p className="text-[10px] text-red-400 font-bold uppercase mb-1 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Port Congestion
                        </p>
                        <p className="text-white text-sm font-semibold">LAX / JFK / ORD</p>
                        <p className="text-[10px] text-red-500 mt-1">Avg Delay: +4 Days</p>
                    </div>
                </div>

                {/* STATUS CARD 3: CUSTOMS RISK */}
                <div className="bg-slate-900/50 border border-slate-700/50 p-4 rounded-xl flex items-center justify-between shadow-lg backdrop-blur-sm">
                    <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Customs Clearance</p>
                        <p className="text-white text-sm font-semibold">ISC Chicago</p>
                        <p className="text-[10px] text-orange-400 mt-1">Status: Slow Scan</p>
                    </div>
                    <Activity className="w-6 h-6 text-orange-500/50" />
                </div>

                {/* STATUS CARD 4: ACTIVE SEIZURES */}
                <div className="bg-slate-900/50 border border-slate-700/50 p-4 rounded-xl flex items-center justify-between shadow-lg backdrop-blur-sm">
                    <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Seizure Risk Idx</p>
                        <p className="text-2xl font-mono text-blue-400 font-bold">LOW</p>
                    </div>
                    <ShieldCheckIcon className="w-6 h-6 text-blue-500/20" />
                </div>
            </div>

            {/* TICKER */}
            <div className="mt-4 flex items-center gap-4 overflow-hidden border-t border-b border-white/5 py-2 bg-black/20">
                <span className="text-[10px] font-mono text-slate-600 whitespace-nowrap">LATEST EVENTS:</span>
                <div className="flex gap-8 animate-marquee whitespace-nowrap">
                    <span className="text-[10px] font-mono text-slate-500">
                        <span className="text-green-500 mr-1">●</span>
                        USPS: Automated Sorting Restored at Memphis Hub
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                        <span className="text-red-500 mr-1">●</span>
                        CN POST: Flights Grounded in Shanghai (Weather)
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                        <span className="text-orange-500 mr-1">●</span>
                        ISC NEW YORK: 48h Backlog Reported
                    </span>
                </div>
            </div>
        </section>
    );
}

function ShieldCheckIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}
