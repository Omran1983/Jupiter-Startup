"use client";

import { Shield, Zap, Truck } from "lucide-react";

const PACKS = [
    {
        id: "starter",
        name: "Starter Pack",
        price: "$5.00",
        credits: 50,
        perSearch: "$0.10",
        icon: Truck,
        benefits: [
            "50 Deep Tracking Scans",
            "Basic AI Risk Assessment",
            "Standard Support"
        ],
        color: "bg-blue-50 text-blue-700 border-blue-200",
        btnColor: "bg-blue-600 hover:bg-blue-700",
        link: "#PAYPAL_LINK_5"
    },
    {
        id: "power",
        name: "Power Pack",
        price: "$15.00",
        credits: 200,
        perSearch: "$0.075",
        icon: Zap,
        benefits: [
            "200 Deep Tracking Scans",
            "⚡ Priority Processing",
            "📲 Telegram Alerts Included",
            "Save 25% vs Starter"
        ],
        color: "bg-purple-50 text-purple-700 border-purple-200 ring-2 ring-purple-500",
        btnColor: "bg-purple-600 hover:bg-purple-700",
        link: "#PAYPAL_LINK_15"
    },
    {
        id: "pro",
        name: "Pro Pack",
        price: "$30.00",
        credits: 500,
        perSearch: "$0.06",
        icon: Shield,
        benefits: [
            "500 Deep Tracking Scans",
            "📊 Bulk CSV Import",
            "📄 Export Official PDFs",
            "Save 40% vs Starter"
        ],
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        btnColor: "bg-emerald-600 hover:bg-emerald-700",
        link: "#PAYPAL_LINK_30"
    }
];

export function BuyCredits() {
    return (
        <div className="mt-12">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Top Up Credits</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PACKS.map((pack) => (
                    <div key={pack.id} className={`p-4 rounded-xl border ${pack.color} flex flex-col relative`}>
                        {pack.id === "power" && (
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Recommended
                            </span>
                        )}

                        <div className="flex justify-between items-start mb-4">
                            <pack.icon className="w-6 h-6" />
                            <div className="text-right">
                                <div className="text-2xl font-bold">{pack.price}</div>
                                <div className="text-xs opacity-70">{pack.perSearch}/search</div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h4 className="font-bold text-lg">{pack.name}</h4>
                            <div className="text-3xl font-black my-2">{pack.credits} <span className="text-sm font-normal opacity-70">credits</span></div>
                        </div>

                        <ul className="mb-6 space-y-2 flex-1">
                            {pack.benefits.map((feature, i) => (
                                <li key={i} className="text-sm flex items-start gap-2">
                                    <span className="opacity-70">✓</span>
                                    <span className="font-medium opacity-90">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <a
                            href={pack.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-full py-2 rounded-lg font-bold text-white text-center transition-colors ${pack.btnColor}`}
                        >
                            Buy Pack
                        </a>
                    </div>
                ))}
            </div>
            <p className="text-xs text-center text-gray-400 mt-6 max-w-sm mx-auto">
                Payments processed securely via PayPal. Credits added instantly.
                <br />Founders Plan (B2B): <a href="#" className="underline">Contact Sales</a>
            </p>
        </div>
    );
}
