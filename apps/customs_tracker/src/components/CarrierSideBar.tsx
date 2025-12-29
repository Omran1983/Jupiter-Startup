export default function CarrierSideBar() {
    return (
        <aside className="hidden xl:flex fixed right-0 top-1/2 -translate-y-1/2 flex-col gap-6 p-6 bg-white/80 backdrop-blur-sm border-l border-gray-100 shadow-sm rounded-l-2xl z-10">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest vertical-rl rotate-180 text-center py-2 border-l border-gray-200 ml-2">
                Supported Carriers
            </p>

            <div className="flex flex-col gap-6 opacity-70 hover:opacity-100 transition-opacity items-center">
                {/* DHL */}
                <span className="text-xl font-black italic text-[#d40511] bg-[#ffcc00] px-2 -skew-x-12 cursor-default hover:scale-110 transition-transform">
                    DHL
                </span>

                {/* UPS */}
                <span className="text-xl font-black text-[#5e2d1d] italic cursor-default hover:scale-110 transition-transform">
                    UPS
                </span>

                {/* FedEx */}
                <div className="flex flex-col items-center cursor-default hover:scale-110 transition-transform">
                    <span className="text-xl font-bold">
                        <span className="text-[#4D148C]">Fed</span><span className="text-[#FF6600]">Ex</span>
                    </span>
                </div>

                {/* USPS */}
                <span className="text-xl font-bold text-[#333366] tracking-tighter cursor-default hover:scale-110 transition-transform">
                    USPS
                </span>

                {/* Royal Mail */}
                <span className="text-sm font-bold text-[#D21F1C] text-center leading-tight cursor-default hover:scale-110 transition-transform">
                    Royal<br />Mail
                </span>

                {/* China Post */}
                <span className="text-xs font-bold text-slate-800 text-center leading-tight cursor-default hover:scale-110 transition-transform">
                    CHINA<br />POST
                </span>

                <div className="h-px w-8 bg-gray-200 my-2"></div>
                <span className="text-xs font-semibold text-gray-400">+ 80 More</span>
            </div>
        </aside>
    );
}
