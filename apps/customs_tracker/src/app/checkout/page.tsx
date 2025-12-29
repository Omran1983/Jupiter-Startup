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
                    ⚠️ Payment Gateway in Test Mode
                </p>

                <div className="p-4 border border-blue-100 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800 mb-3">To complete purchase instantly:</p>
                    <a
                        href="https://paypal.me/YOUR_HANDLE_HERE"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-[#0070BA] text-white font-bold py-3 rounded-lg hover:bg-[#005ea6] transition-colors"
                    >
                        Pay with PayPal
                    </a>
                    <p className="text-xs text-blue-600 mt-2">
                        Mention your email in the note. Credits added immediately by Admin.
                    </p>
                </div>

                <Link href="/" className="block text-sm text-gray-400 hover:text-gray-600 underline">
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
