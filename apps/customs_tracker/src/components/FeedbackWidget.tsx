"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Send, X } from "lucide-react";
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
        setTimeout(() => setIsOpen(false), 3000);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 bg-slate-800 text-slate-300 px-4 py-2 rounded-full shadow-lg border border-slate-700 hover:bg-slate-700 transition-all text-xs flex items-center gap-2"
            >
                💬 Feedback?
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 overflow-hidden animate-in slide-in-from-bottom-5">
            <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 text-slate-500 hover:text-white"
                aria-label="Close Feedback"
            >
                <X className="w-4 h-4" />
            </button>

            {step === "initial" && (
                <div className="text-center">
                    <h3 className="text-sm font-bold text-white mb-3">Did this search help?</h3>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => { setRating("up"); setStep("form"); }}
                            className="p-3 bg-green-500/10 hover:bg-green-500/20 rounded-full text-green-400 transition-colors"
                            aria-label="Thumbs Up"
                        >
                            <ThumbsUp className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => { setRating("down"); setStep("form"); }}
                            className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-full text-red-400 transition-colors"
                            aria-label="Thumbs Down"
                        >
                            <ThumbsDown className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}

            {step === "form" && (
                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-white">
                        {rating === "up" ? "Great! Any suggestions?" : "Sorry! What went wrong?"}
                    </h3>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tell us more..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 h-20"
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email (for free reward)"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-2"
                    >
                        {loading ? "Sending..." : "Send & Get Reward"} <Send className="w-3 h-3" />
                    </button>
                    <p className="text-[10px] text-slate-500 text-center">
                        Reward: 'Anti-Dispute Guide' (PDF)
                    </p>
                </div>
            )}

            {step === "success" && (
                <div className="text-center py-4">
                    <span className="text-2xl">🎉</span>
                    <h3 className="text-sm font-bold text-white mt-2">Thank You!</h3>
                    <p className="text-xs text-slate-400">Your feedback helps us improve.</p>
                </div>
            )}
        </div>
    );
}
