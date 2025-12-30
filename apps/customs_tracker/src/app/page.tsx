import { submitTracking } from "../actions/submit_tracking";
import { Search } from "lucide-react";
import { CreditBalance } from "../components/CreditBalance";
import { BuyCredits } from "../components/BuyCredits";

export default function Home() {
    return (
        <div className="w-full max-w-4xl mx-auto p-4 flex flex-col justify-center min-h-[80vh]">
            <div className="flex justify-end mb-8">
                <CreditBalance credits={0} />
            </div>

            <div className="w-full max-w-lg mx-auto bg-slate-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-700/50">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                        Is it stuck?
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Check if your package is actually lost or just in a "Dark Handover".
                        <br />Stop refunding blindly.
                    </p>
                </div>

                <form action={submitTracking} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Carrier</label>
                        <select
                            name="carrier"
                            aria-label="Select Carrier"
                            className="w-full p-3.5 border border-slate-700 rounded-xl bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all hover:border-slate-600 appearance-none"
                            defaultValue="USPS"
                        >
                            <option value="USPS">USPS</option>
                            <option value="UPS">UPS</option>
                            <option value="FedEx">FedEx</option>
                            <option value="DHL">DHL</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tracking Number</label>
                        <input
                            name="trackingNumber"
                            type="text"
                            placeholder="e.g. LY123456789CN"
                            className="w-full p-3.5 border border-slate-700 rounded-xl bg-slate-900 text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all hover:border-slate-600 font-mono"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Destination</label>
                        <select
                            name="destinationCountry"
                            aria-label="Select Destination Country"
                            className="w-full p-3.5 border border-slate-700 rounded-xl bg-slate-900 text-slate-200 outline-none appearance-none"
                            defaultValue="US"
                        >
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="GB">United Kingdom</option>
                            <option value="AU">Australia</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98] mt-2"
                    >
                        <Search className="w-5 h-5" />
                        Analyze Status (1 Credit)
                    </button>

                    <p className="text-[10px] text-center text-slate-600 mt-6">
                        By clicking Analyze, you agree to our Terms. Not legal advice.
                    </p>
                </form>
            </div>

            <div className="mt-8">
                <BuyCredits />
            </div>
        </div>
    );
}
