"use client";

import { useState } from "react";
import { Send, X, FileText, AlertTriangle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export function FeedbackWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<"initial" | "success">("initial");
    const [comment, setComment] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!comment || !email) return;
        setLoading(true);
        const supabase = createClient();
        await supabase.from("feedback").insert({
            rating: 1, // Defaulting to 1 (Problem Report)
            comment: `(Lead Magnet) ${comment}`,
            email
        });
        setLoading(false);
        setStep("success");
        setTimeout(() => {
            setIsOpen(false);
            setStep("initial");
        }, 3000);
    };

    // 1. Minimized State (Value Hook)
    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 group flex items-center gap-3 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-900/30 transition-all duration-300 hover:scale-105 z-50 animate-pulse-slow"
                aria-label="Get Free Guide"
            >
                <div className="relative">
                    <FileText className="w-4 h-4" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                </div>
                <div className="flex flex-col items-start -space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-blue-200">Free Gift</span>
                    <span className="text-xs font-bold">Anti-Dispute Guide</span>
                </div>
            </button>
        );
    }

    // 2. Expanded State (The Trade)
    return (
        <div className="fixed bottom-6 right-6 w-80 z-50 animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative">

                {/* Header Gradient */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500" />

                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-3 right-3 text-slate-500 hover:text-white transition-colors p-1"
                    aria-label="Close"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="p-6 pt-8">
                    {step === "initial" && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white leading-tight">Unlock the Anti-Dispute Guide</h3>
                                    <p className="text-[10px] text-slate-400">Worth $49. Yours for free.</p>
                                </div>
                            </div>

                            <div className="bg-slate-900/50 p-3 rounded-lg border border-white/5">
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    <span className="text-blue-400 font-bold">Help us Build Better:</span> How can we <span className="text-white font-bold">Enhance</span> the platform for you?
                                </p>
                            </div>

                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your ideas for improvement..."
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all h-20 resize-none"
                                autoFocus
                            />

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email (to send PDF)"
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
                            />

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                            >
                                {loading ? "Unlocking..." : "Send & Unlock PDF"} <Send className="w-3 h-3" />
                            </button>
                        </div>
                    )}

                    {step === "success" && (
                        <div className="text-center py-8 animate-in fade-in zoom-in-95 duration-300">
                            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-green-500/20">
                                <Send className="w-6 h-6 text-green-400" />
                            </div>
                            <h3 className="text-sm font-bold text-white mb-1">Check your Inbox!</h3>
                            <p className="text-xs text-slate-500">The guide is on its way.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
