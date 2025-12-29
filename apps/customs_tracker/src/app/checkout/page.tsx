"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function CheckoutContent() {
    const searchParams = useSearchParams();
    const packId = searchParams.get("pack");

    const PACK_DETAILS: any = {
        starter: { name: "Starter Pack", price: "$5.00", credits: 50 },
        power: { name: "Power Pack", price: "$15.00", credits: 200 },
        pro: { name: "Pro Pack", price: "$30.00", credits: 500 },
    };

    const pack = PACK_DETAILS[packId || "starter"];

    return (
        <div className="w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100 mt-10 text-center">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Checkout</h1>
                <p className="text-gray-500">Complete your purchase securely.</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-8 text-left">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-700">Item</span>
                    <span className="font-medium">{pack?.name}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-gray-700">Credits</span>
                    <span className="font-medium">+{pack?.credits}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">{pack?.price}</span>
                </div>
            </div>

            {/* PAYMENT METHOD SECTION */}
            <div className="space-y-4">
                <p className="text-sm font-semibold text-yellow-600 bg-yellow-50 p-3 rounded-md border border-yellow-100">
                    ⚠️ Instant Automation via PayPal Only
                </p>

                {/* OPTION 1: PAYPAL */}
                <div className="p-4 border border-blue-100 bg-blue-50 rounded-lg">
                    <p className="text-sm font-bold text-blue-800 mb-2 text-left">Option 1: PayPal (Instant)</p>
                    <a
                        href="https://paypal.me/UseYourManualHandleHere"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-[#0070BA] text-white font-bold py-3 rounded-lg hover:bg-[#005ea6] transition-colors"
                    >
                        Pay with PayPal
                    </a>
                    <p className="text-xs text-blue-600 mt-2 text-left">
                        *Instant Credit Activation
                    </p>
                </div>

                {/* OPTION 2: BANK TRANSFER */}
                <div className="p-4 border border-gray-200 bg-gray-50 rounded-lg text-left">
                    <p className="text-sm font-bold text-gray-700 mb-3">Option 2: Bank Transfer (MCB / USD)</p>
                    <div className="text-xs text-gray-800 space-y-1 font-mono bg-white p-3 rounded border border-gray-200 select-all cursor-text">
                        <p className="font-bold">A - ONE GLOBAL RESOUR LTD</p>
                        <p>Bank: MCB (Mauritius Commercial Bank)</p>
                        <p>IBAN: MU62MCBL0901000449347206000USD</p>
                        <p>Acc No: 000449347206</p>
                        <p className="mt-2 text-blue-600">Ref: {packId?.toUpperCase() || "CREDITS"}-{Math.floor(Math.random() * 1000)}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Send proof to <strong>deals@aogrl.com</strong> or WhatsApp <strong>+230 5788 7132</strong>.
                    </p>
                </div>

                <Link href="/" className="block text-sm text-gray-400 hover:text-gray-600 underline text-center mt-4">
                    Cancel and return home
                </Link>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
            <Suspense fallback={<div>Loading checkout...</div>}>
                <CheckoutContent />
            </Suspense>
        </div>
    );
}
