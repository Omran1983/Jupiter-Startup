"use client";

import { Shield, FileText, Lock } from "lucide-react";
import Link from "next/link";

const PACKS = [
    {
        id: "starter",
        name: "Starter Protection",
        price: "$5.00",
        credits: 5,
        perReport: "$1.00",
        icon: FileText,
        benefits: [
            "5 Chargeback Shield Reports",
            "PDF Legal Proof of Delivery",
            "Win PayPal/Bank Disputes",
            "Basic Email Support"
        ],
        color: "bg-blue-50 text-blue-700 border-blue-200",
        btnColor: "bg-blue-600 hover:bg-blue-700",
        link: "/checkout?pack=starter"
    },
    {
        id: "pro",
        name: "Pro Shield",
        price: "$15.00",
        credits: 20,
        perReport: "$0.75",
        icon: Shield,
        benefits: [
            "20 Chargeback Shield Reports",
            "Priority PDF Generation",
            "Bulk Tracking Analysis (CSV)",
            "Telegram Alerts",
            "Priority Support"
        ],
        color: "bg-purple-50 text-purple-700 border-purple-200 ring-2 ring-purple-500",
        btnColor: "bg-purple-600 hover:bg-purple-700",
        link: "/checkout?pack=pro"
    },
    {
        id: "enterprise",
        name: "Agency Plan",
        price: "$45.00",
        credits: 100,
        perReport: "$0.45",
        icon: Lock,
        benefits: [
            "100 Chargeback Shield Reports",
            "White-Label PDFs (No Logo)",
            "API Access Key",
            "Dedicated Account Manager",
            "Export Audit Logs"
        ],
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        btnColor: "bg-emerald-600 hover:bg-emerald-700",
        link: "/checkout?pack=enterprise"
    }
];

export function BuyCredits() {
    return (
        <section className="py-8" id="pricing">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-white mb-3">Chargeback Protection Plans</h2>
                <p className="text-slate-400 max-w-xl mx-auto">
                    Basic tracking is always <span className="text-green-400 font-bold">Free</span>.
                    Upgrade to generate official <strong>Legal PDF Reports</strong> to win disputes and protect your revenue.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {PACKS.map((pack) => (
                    <div key={pack.id} className={`relative p-6 rounded-2xl border ${pack.color} bg-white transition-transform hover:-translate-y-1 shadow-lg`}>
                        {pack.id === "pro" && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                Most Popular
                            </div>
                        )}

                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-2 rounded-lg ${pack.id === 'pro' ? 'bg-purple-100' : pack.id === 'enterprise' ? 'bg-emerald-100' : 'bg-blue-100'}`}>
                                <pack.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">{pack.name}</h3>
                        </div>

                        <div className="mb-6">
                            <span className="text-4xl font-black text-slate-900">{pack.price}</span>
                            <div className="text-sm font-medium opacity-80 mt-1">
                                {pack.credits} Reports <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 ml-2">({pack.perReport}/report)</span>
                            </div>
                        </div>

                        <ul className="space-y-3 mb-8">
                            {pack.benefits.map((benefit, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                                    <span className="text-green-500 font-bold">✓</span> {benefit}
                                </li>
                            ))}
                        </ul>

                        <Link
                            href={pack.link}
                            className={`block w-full py-3 rounded-xl font-bold text-center text-white transition-all shadow-lg active:scale-[0.98] ${pack.btnColor}`}
                        >
                            Get Protection
                        </Link>

                        <p className="text-[10px] text-center text-slate-400 mt-4">
                            Secure Payment via <span className="text-white font-bold">PayPal</span> (Buyer Protection)
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-8 text-center">
                <a href="mailto:deals@aogrl.com?subject=Agency Plan Inquiry" className="text-xs text-slate-500 hover:text-white transition-colors border-b border-transparent hover:border-slate-500">
                    Need Custom Volume? Contact Sales
                </a>
            </div>
        </section>
    );
}
