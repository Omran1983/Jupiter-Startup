import { submitTracking } from "../actions/submit_tracking";
import { Search } from "lucide-react";

export default function Home() {
    return (
        <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-sm border border-gray-200">
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
                    Analyze Status
                </button>

                <p className="text-xs text-center text-gray-400 mt-4">
                    By clicking Analyze, you agree to our Terms. Not legal advice.
                </p>
            </form>
        </div>
    );
}
