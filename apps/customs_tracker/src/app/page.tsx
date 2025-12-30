import { submitTracking } from "../actions/submit_tracking";
import { Search } from "lucide-react";
import { CreditBalance } from "../components/CreditBalance";
import { BuyCredits } from "../components/BuyCredits";
import FeaturesGrid from "../components/FeaturesGrid";
import TrustSection from "../components/TrustSection";
import NetworkStatus from "../components/NetworkStatus";

export default function Home() {
    return (
        <div className="w-full flex flex-col min-h-screen">
            {/* HERO SECTION */}
            <div className="w-full max-w-4xl mx-auto p-4 flex flex-col justify-center min-h-[70vh]">
                <div className="flex justify-end mb-8">
                    <CreditBalance credits={0} />
                </div>

                <div className="w-full max-w-lg mx-auto bg-slate-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-700/50">
                    <div className="text-center mb-8 relative">
                        <div className="absolute -top-6 right-0 flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">System Live</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 drop-shadow-2xl tracking-tight">
                            Is it stuck?
                        </h1>
                        <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-sm mx-auto">
                            Check if your package is <span className="text-red-400 font-bold border-b border-red-400/30">actually lost</span> or just in a "Dark Handover". Stop refunding blindly.
                        </p>
                    </div>

                    <form action={submitTracking} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 ml-1">Carrier Network</label>
                            <div className="relative group">
                                <select
                                    name="carrier"
                                    aria-label="Select Carrier"
                                    className="w-full p-4 border border-slate-700/50 rounded-xl bg-slate-900/50 text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all hover:bg-slate-800 appearance-none backdrop-blur-sm shadow-inner cursor-pointer"
                                    defaultValue="USPS"
                                >
                                    <option value="USPS">USPS (United States)</option>
                                    <option value="UPS">UPS (Global)</option>
                                    <option value="FedEx">FedEx (Express)</option>
                                    <option value="DHL">DHL (International)</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-blue-400 transition-colors">
                                    ▼
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 ml-1">Tracking Number</label>
                            <input
                                name="trackingNumber"
                                type="text"
                                placeholder="e.g. LY123456789CN"
                                className="w-full p-4 text-lg border border-slate-700/50 rounded-xl bg-slate-900/50 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all hover:bg-slate-800 font-mono shadow-inner tracking-wide"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 ml-1">Destination</label>
                            <div className="relative group">
                                <select
                                    name="destinationCountry"
                                    aria-label="Select Destination Country"
                                    className="w-full p-4 border border-slate-700/50 rounded-xl bg-slate-900/50 text-slate-200 outline-none appearance-none hover:bg-slate-800 transition-all focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 shadow-inner cursor-pointer"
                                    defaultValue="US"
                                >
                                    <option value="US">🇺🇸 United States</option>
                                    <option value="CA">🇨🇦 Canada</option>
                                    <option value="GB">🇬🇧 United Kingdom</option>
                                    <option value="AU">🇦🇺 Australia</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-blue-400 transition-colors">
                                    ▼
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98] mt-2 group"
                        >
                            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Analyze Status (1 Credit)
                        </button>

                        <p className="text-[10px] text-center text-slate-600 mt-6">
                            By clicking Analyze, you agree to our Terms. Not legal advice.
                        </p>
                    </form>
                </div>
            </div>

            {/* INTELLIGENCE LAYER */}
            <NetworkStatus />

            {/* CONTENT FILL */}
            <TrustSection />
            <FeaturesGrid />

            <div className="w-full max-w-4xl mx-auto px-4 pb-20">
                <BuyCredits />
            </div>
        </div>
    );
}
