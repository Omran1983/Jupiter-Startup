import Link from "next/link";

export default function CarrierSideBar() {
    return (
        <aside className="hidden xl:flex fixed right-0 top-1/2 -translate-y-1/2 flex-col gap-6 p-6 bg-slate-800/40 backdrop-blur-md border-l border-white/5 shadow-2xl rounded-l-2xl z-10 hover:bg-slate-800/80 transition-all group">
            <div className="text-center py-2 border-b border-white/5 mb-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Free Claim Tools
                </p>
                <p className="text-[9px] text-blue-400 mt-1 animate-pulse">
                    ⚡ Click Logo for Templates
                </p>
            </div>

            <div className="flex flex-col gap-6 items-center grayscale hover:grayscale-0 duration-300">
                {/* DHL */}
                <Link href="/carriers/dhl" title="Get DHL Claim Template">
                    <span className="text-xl font-black italic text-[#d40511] bg-[#ffcc00] px-2 -skew-x-12 cursor-pointer hover:scale-125 transition-all shadow-lg block hover:ring-2 hover:ring-white">
                        DHL
                    </span>
                </Link>

                {/* UPS */}
                <Link href="/carriers/ups" title="Get UPS Claim Template">
                    <span className="text-xl font-black text-[#5e2d1d] bg-white px-1 italic cursor-pointer hover:scale-125 transition-all shadow-lg block hover:ring-2 hover:ring-[#5e2d1d]">
                        UPS
                    </span>
                </Link>

                {/* FedEx */}
                <Link href="/carriers/fedex" title="Get FedEx Claim Template">
                    <div className="flex flex-col items-center cursor-pointer hover:scale-125 transition-all bg-white px-1 shadow-lg hover:ring-2 hover:ring-[#4D148C]">
                        <span className="text-xl font-bold">
                            <span className="text-[#4D148C]">Fed</span><span className="text-[#FF6600]">Ex</span>
                        </span>
                    </div>
                </Link>

                {/* USPS */}
                <Link href="/carriers/usps" title="Get USPS Claim Template">
                    <span className="text-xl font-bold text-[#333366] bg-white px-1 tracking-tighter cursor-pointer hover:scale-125 transition-all shadow-lg block hover:ring-2 hover:ring-[#333366]">
                        USPS
                    </span>
                </Link>

                {/* Royal Mail */}
                <Link href="/carriers/royal_mail" title="Get Royal Mail Claim Template">
                    <span className="text-sm font-bold text-[#D21F1C] bg-white p-1 text-center leading-tight cursor-pointer hover:scale-125 transition-all shadow-lg block hover:ring-2 hover:ring-[#D21F1C]">
                        Royal<br />Mail
                    </span>
                </Link>

                {/* China Post */}
                <Link href="/carriers/china_post" title="Get China Post Claim Template">
                    <span className="text-xs font-bold text-slate-800 bg-white p-1 text-center leading-tight cursor-pointer hover:scale-125 transition-all shadow-lg block hover:ring-2 hover:ring-slate-800">
                        CHINA<br />POST
                    </span>
                </Link>

                <div className="h-px w-8 bg-gray-500 my-2"></div>
                <Link href="#" className="text-xs font-semibold text-blue-400 hover:text-white hover:underline whitespace-nowrap">
                    View All &rarr;
                </Link>
            </div>
        </aside>
    );
}
