"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Send, X, MessageSquarePlus } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export function FeedbackWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<"initial" | "form" | "success">("initial");
    const [rating, setRating] = useState<"up" | "down" | null>(null);
    const [comment, setComment] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        const supabase = createClient();
        await supabase.from("feedback").insert({
            rating: rating === "up" ? 5 : 1,
            comment,
            email
        });
        setLoading(false);
        setStep("success");
        setTimeout(() => {
            setIsOpen(false);
            setStep("initial");
        }, 3000);
    };

    // 1. Minimized State (Sleek Ghost Pill)
    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 group flex items-center gap-2 px-4 py-2 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 hover:border-blue-500/50 z-50"
                aria-label="Open Feedback"
            >
                <MessageSquarePlus className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">Feedback</span>
            </button>
        );
    }

    // 2. Expanded State (Glass Card)
    return (
        <div className="fixed bottom-6 right-6 w-80 z-50 animate-in slide-in-from-bottom-4 duration-300">
            {/* Glass Container */}
            <div className="bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative">

                {/* Header Gradient Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-50" />

                {/* Close Button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-3 right-3 text-slate-500 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                    aria-label="Close"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="p-6">
                    {step === "initial" && (
                        <div className="text-center space-y-4">
                            <h3 className="text-sm font-semibold text-slate-200">Is this data helpful?</h3>
                            <div className="flex justify-center gap-6">
                                <button
                                    onClick={() => { setRating("up"); setStep("form"); }}
                                    className="group flex flex-col items-center gap-2 opacity-70 hover:opacity-100 transition-all duration-300"
                                    aria-label="Thumbs Up"
                                >
                                    <div className="p-4 bg-white/5 group-hover:bg-green-500/20 rounded-2xl border border-white/5 group-hover:border-green-500/30 transition-all">
                                        <ThumbsUp className="w-6 h-6 text-slate-400 group-hover:text-green-400" />
                                    </div>
                                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Yes</span>
                                </button>

                                <button
                                    onClick={() => { setRating("down"); setStep("form"); }}
                                    className="group flex flex-col items-center gap-2 opacity-70 hover:opacity-100 transition-all duration-300"
                                    aria-label="Thumbs Down"
                                >
                                    <div className="p-4 bg-white/5 group-hover:bg-red-500/20 rounded-2xl border border-white/5 group-hover:border-red-500/30 transition-all">
                                        <ThumbsDown className="w-6 h-6 text-slate-400 group-hover:text-red-400" />
                                    </div>
                                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">No</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {step === "form" && (
                        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                                {rating === "up" ? (
                                    <><ThumbsUp className="w-4 h-4 text-green-400" /> What did you like?</>
                                ) : (
                                    <><ThumbsDown className="w-4 h-4 text-red-400" /> How can we improve?</>
                                )}
                            </h3>

                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Your feedback..."
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all h-24 resize-none"
                                autoFocus
                            />

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold ml-1">
                                    Get the "Anti-Dispute Guide" (Optional)
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
                                />
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 transition-all hover:translate-y-[-1px] active:translate-y-[1px]"
                            >
                                {loading ? "Sending..." : "Submit Feedback"} <Send className="w-3 h-3" />
                            </button>
                        </div>
                    )}

                    {step === "success" && (
                        <div className="text-center py-8 animate-in fade-in zoom-in-95 duration-300">
                            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-green-500/20">
                                <Send className="w-6 h-6 text-green-400" />
                            </div>
                            <h3 className="text-base font-bold text-white mb-1">Feedback Sent</h3>
                            <p className="text-xs text-slate-500">Thank you for helping us build better.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
