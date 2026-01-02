import Link from "next/link";
import { ArrowRight, BookOpen, Shield, Zap } from "lucide-react";

export const metadata = {
    title: "Logistics Intelligence Blog | Customs Tracker",
    description: "Expert insights on dropshipping logistics, customs delays, and dark handover tracking.",
};

export default function BlogIndex() {
    const posts = [
        {
            slug: "dark-handover",
            title: "Why Your Yanwen Package Isn't Lost (It's Just Invisible)",
            excerpt: "The 'Dark Handover' between China export and local import is where 90% of panic happens. Here's how to see inside the black hole.",
            icon: Zap,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
        },
        {
            slug: "chargeback-shield",
            title: "How to Win 'Item Not Received' Disputes",
            excerpt: "Don't go into PayPal arbitration naked. Learn how a Chain of Custody report acts as your legal shield against auto-refunds.",
            icon: Shield,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            slug: "risk-scores",
            title: "Does Your HS Code Flag You for Inspection?",
            excerpt: "Customs isn't random. AI targets specific codes. Know your Risk Score before you ship to avoid 14-day delays.",
            icon: BookOpen,
            color: "text-red-500",
            bg: "bg-red-500/10",
        },
    ];

    return (
        <div className="w-full min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Logistics Intelligence</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Stop guessing. Start shipping with precision.
                        Tactical guides for high-volume dropshippers.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-1">
                    {posts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group block p-8 rounded-2xl border border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 bg-white"
                        >
                            <div className="flex items-start gap-6">
                                <div className={`p-4 rounded-xl ${post.bg} ${post.color} group-hover:scale-110 transition-transform`}>
                                    <post.icon className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed mb-4">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center text-sm font-bold text-gray-900 group-hover:translate-x-2 transition-transform">
                                        Read Strategy <ArrowRight className="w-4 h-4 ml-2" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-20 p-8 bg-slate-900 rounded-2xl text-center text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-4">Ready to stop bleeding revenue?</h2>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/50"
                        >
                            Run a Free Analysis
                        </Link>
                    </div>
                    {/* Abstract background elements */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/20 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/20 blur-3xl rounded-full translate-x-1/2 translate-y-1/2"></div>
                </div>
            </div>
        </div>
    );
}
