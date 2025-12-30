import Link from "next/link";

export default function CarrierSideBar() {
    return (
        <aside className="hidden xl:flex fixed right-0 top-1/2 -translate-y-1/2 flex-col gap-6 p-6 bg-slate-800/20 backdrop-blur-sm border-l border-white/5 shadow-2xl rounded-l-2xl z-10 hover:bg-slate-800/40 transition-colors">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center py-2 border-b border-white/5 mb-2">
                Supported<br />Carriers
            </p>

            <div className="flex flex-col gap-6 opacity-60 hover:opacity-100 transition-opacity items-center grayscale hover:grayscale-0 duration-500">
                {/* DHL */}
                <Link href="/carriers/dhl">
                    <span className="text-xl font-black italic text-[#d40511] bg-[#ffcc00] px-2 -skew-x-12 cursor-pointer hover:scale-110 transition-transform shadow-lg block">
                        DHL
                    </span>
                </Link>

                {/* UPS */}
                <Link href="/carriers/ups">
                    <span className="text-xl font-black text-[#5e2d1d] bg-white px-1 italic cursor-pointer hover:scale-110 transition-transform shadow-lg block">
                        UPS
                    </span>
                </Link>

                {/* FedEx */}
                <Link href="/carriers/fedex">
                    <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform bg-white px-1 shadow-lg">
                        <span className="text-xl font-bold">
                            <span className="text-[#4D148C]">Fed</span><span className="text-[#FF6600]">Ex</span>
                        </span>
                    </div>
                </Link>

                {/* USPS */}
                <Link href="/carriers/usps">
                    <span className="text-xl font-bold text-[#333366] bg-white px-1 tracking-tighter cursor-pointer hover:scale-110 transition-transform shadow-lg block">
                        USPS
                    </span>
                </Link>

                {/* Royal Mail */}
                <Link href="/carriers/royal_mail">
                    <span className="text-sm font-bold text-[#D21F1C] bg-white p-1 text-center leading-tight cursor-pointer hover:scale-110 transition-transform shadow-lg block">
                        Royal<br />Mail
                    </span>
                </Link>

                {/* China Post */}
                <Link href="/carriers/china_post">
                    <span className="text-xs font-bold text-slate-800 bg-white p-1 text-center leading-tight cursor-pointer hover:scale-110 transition-transform shadow-lg block">
                        CHINA<br />POST
                    </span>
                </Link>

                <div className="h-px w-8 bg-gray-200 my-2"></div>
                <span className="text-xs font-semibold text-gray-400">+ 80 More</span>
            </div>
        </aside>
    );
}
