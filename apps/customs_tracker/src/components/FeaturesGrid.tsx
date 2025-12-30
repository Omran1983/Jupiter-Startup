import { ShieldCheck, Search, FileText } from "lucide-react";

export default function FeaturesGrid() {
    return (
        <section className="w-full max-w-6xl mx-auto px-4 py-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Feature 1: Deep Search */}
                <div className="bg-slate-800/40 backdrop-blur-sm p-8 rounded-2xl border border-white/5 hover:bg-slate-800/60 transition-colors group">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                        <Search className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Deep Carrier Scan</h3>
                    <p className="text-slate-400 leading-relaxed">
                        We don't just ping the tracking API. We analyze internal "handover" events between last-mile carriers to find where your package actually is.
                    </p>
                </div>

                {/* Feature 2: Legal Proof */}
                <div className="bg-slate-800/40 backdrop-blur-sm p-8 rounded-2xl border border-white/5 hover:bg-slate-800/60 transition-colors group">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-6 text-green-400 group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Chargeback Protection</h3>
                    <p className="text-slate-400 leading-relaxed">
                        Generate official PDF "Chain of Custody" reports. Use them as evidence to win PayPal disputes and chargebacks instantly.
                    </p>
                </div>

                {/* Feature 3: AI Analysis */}
                <div className="bg-slate-800/40 backdrop-blur-sm p-8 rounded-2xl border border-white/5 hover:bg-slate-800/60 transition-colors group">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Risk Assessment</h3>
                    <p className="text-slate-400 leading-relaxed">
                        Our AI predicts the probability of delivery failure based on current port congestion and carrier delays in real-time.
                    </p>
                </div>
            </div>
        </section>
    );
}
