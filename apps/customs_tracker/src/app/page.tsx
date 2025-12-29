import { submitTracking } from "../actions/submit_tracking";
import { Search } from "lucide-react";
import { CreditBalance } from "../components/CreditBalance";
import { BuyCredits } from "../components/BuyCredits";

export default function Home() {
    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <div className="flex justify-end mb-4">
                <CreditBalance credits={0} />
            </div>

            <div className="w-full max-w-lg mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">Is it stuck?</h2>
                    <p className="text-gray-500">
                        Check if your package is actually lost or just in a regulation hold.
                        Stop refunding too early.
                    </p>
                </div>

                <form action={submitTracking} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Carrier</label>
                        <select
                            name="carrier"
                            aria-label="Select Carrier"
                            className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                            defaultValue="USPS"
                        >
                            <option value="USPS">USPS</option>
                            <option value="UPS">UPS</option>
                            <option value="FedEx">FedEx</option>
                            <option value="DHL">DHL</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Tracking Number</label>
                        <input
                            name="trackingNumber"
                            type="text"
                            placeholder="e.g. LM123456789US"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Destination Country</label>
                        <select
                            name="destinationCountry"
                            aria-label="Select Destination Country"
                            className="w-full p-3 border rounded-lg bg-gray-50 outline-none"
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
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                        <Search className="w-5 h-5" />
                        Analyze Status (1 Credit)
                    </button>

                    <p className="text-xs text-center text-gray-400 mt-4">
                        By clicking Analyze, you agree to our Terms. Not legal advice.
                    </p>
                </form>
            </div>

            <div className="mt-8 text-center pb-8 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-widest">Supports 85+ Global Carriers</p>
                <div className="flex flex-wrap justify-center items-center gap-6 opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
                    <span className="text-2xl font-black italic text-[#d40511] bg-[#ffcc00] px-2 -skew-x-12">DHL</span>
                    <span className="text-2xl font-black text-[#5e2d1d] italic">UPS</span>
                    <span className="text-2xl font-bold"><span className="text-[#4D148C]">Fed</span><span className="text-[#FF6600]">Ex</span></span>
                    <span className="text-2xl font-bold text-[#333366] tracking-tighter">USPS</span>
                    <span className="text-xl font-bold text-[#D21F1C]">Royal Mail</span>
                    <span className="text-xl font-bold text-slate-800">CHINA POST</span>
                </div>
            </div>

            <BuyCredits />
        </div>
    );
}
