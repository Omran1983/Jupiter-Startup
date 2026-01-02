"use client";

import { Share2 } from "lucide-react";

interface ShareButtonProps {
    title: string;
}

export function ShareButton({ title }: ShareButtonProps) {
    return (
        <button
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
            aria-label="Share article"
            onClick={() => {
                if (typeof window !== 'undefined') {
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
                }
            }}
        >
            <Share2 className="w-5 h-5" />
        </button>
    );
}
