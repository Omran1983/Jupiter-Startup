"use client";

import { Wallet } from "lucide-react";

export function CreditBalance({ credits }: { credits: number }) {
    return (
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-2 rounded-full text-sm font-bold border border-emerald-200">
            <Wallet className="w-4 h-4" />
            <span>{credits} Credits</span>
        </div>
    );
}
