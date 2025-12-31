export default function TrustSection() {
    return (
        <section className="w-full border-y border-white/5 bg-slate-900/50 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">
                    Trusted for Cross-Border Dispute Resolution
                </p>

                <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Simplified Text Logos for Speed */}
                    <span className="text-xl font-bold text-slate-300">Shopify</span>
                    <span className="text-xl font-bold text-slate-300">WooCommerce</span>
                    <span className="text-xl font-bold text-slate-300">PayPal</span>
                    <span className="text-xl font-bold text-slate-300">eBay</span>
                    <span className="text-xl font-bold text-slate-300">AliExpress</span>
                </div>
            </div>
        </section>
    );
}
