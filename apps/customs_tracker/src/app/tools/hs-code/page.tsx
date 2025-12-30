import HSCodeSearch from "@/components/HSCodeSearch";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
    title: "HS Code Detective | Customs Tracker",
    description: "Instant Duty Rate and Seizure Risk analysis for dropshipping products.",
};

export default function HSCodePage() {
    return (
        <div className="min-h-screen py-20 px-4 flex flex-col items-center">
            <div className="w-full max-w-5xl mb-8">
                <Link href="/" className="text-slate-400 hover:text-white flex items-center gap-2 mb-8 text-sm transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Tracker
                </Link>
            </div>

            <div className="w-full max-w-5xl text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black mb-4 text-white">
                    HS Code Detective <span className="text-blue-500">2.0</span>
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    Search our live database of product classifications to instantly find <strong>Duty Rates (US/EU)</strong> and <strong>Seizure Risk Levels</strong>.
                    <br />Don't ship blind.
                </p>
            </div>

            <HSCodeSearch />
        </div>
    );
}
