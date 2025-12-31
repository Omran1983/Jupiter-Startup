import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import Header from "@/components/Header";

const CARRIERS = [
    { name: "USPS", region: "United States", type: "Postal" },
    { name: "UPS", region: "Global", type: "Express" },
    { name: "FedEx", region: "Global", type: "Express" },
    { name: "DHL", region: "Global", type: "Express" },
    { name: "Royal Mail", region: "United Kingdom", type: "Postal" },
    { name: "Canada Post", region: "Canada", type: "Postal" },
    { name: "Australia Post", region: "Australia", type: "Postal" },
    { name: "China Post", region: "China", type: "Postal" },
    { name: "Yanwen", region: "China", type: "Logistics" },
    { name: "YunExpress", region: "China", type: "Logistics" },
    { name: "Cainiao", region: "China", type: "Logistics" },
    { name: "4PX", region: "China", type: "Logistics" },
    { name: "La Poste", region: "France", type: "Postal" },
    { name: "Deutsche Post", region: "Germany", type: "Postal" },
    { name: "PostNL", region: "Netherlands", type: "Postal" },
    { name: "Singapore Post", region: "Singapore", type: "Postal" },
    { name: "Japan Post", region: "Japan", type: "Postal" },
    { name: "Correos", region: "Spain", type: "Postal" },
    { name: "Poste Italiane", region: "Italy", type: "Postal" },
    { name: "New Zealand Post", region: "New Zealand", type: "Postal" },
];

export default function CarriersPage() {
    return (
        <div className="w-full flex flex-col min-h-screen bg-[#020617] text-slate-200">
            <Header />

            <main className="flex-grow pt-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-4 mb-10">
                        <Link href="/" className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                            <ArrowLeft className="w-5 h-5 text-slate-400" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black text-white">Supported Carrier Network</h1>
                            <p className="text-slate-400">We integrate with 80+ global logistics providers for deep-scan tracking.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                        {CARRIERS.map((c) => (
                            <div key={c.name} className="p-4 bg-slate-900/50 border border-white/5 rounded-xl hover:border-blue-500/30 transition-all group">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">{c.name}</h3>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${c.type === 'Express' ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-700 text-slate-400'}`}>
                                        {c.type}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500">{c.region}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center p-10 bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-2xl border border-blue-500/20 mb-20">
                        <h2 className="text-2xl font-bold text-white mb-4">Don't see your carrier?</h2>
                        <p className="text-slate-400 mb-6 max-w-lg mx-auto">
                            Our "Auto-Detect" engine supports hundreds of smaller couriers.
                            Just enter your tracking number on the homepage.
                        </p>
                        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all">
                            <Search className="w-4 h-4" />
                            Test Tracking Number
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
