"use client";

import { useState } from "react";
import { runDiagnostics } from "@/actions/debug_feedback";

export default function FeedbackDebugPage() {
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const check = async () => {
        setLoading(true);
        try {
            const res = await runDiagnostics();
            setResult(res);
        } catch (e: any) {
            setResult({ error: e.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-10 max-w-2xl mx-auto font-mono">
            <h1 className="text-2xl font-bold mb-4">Feedback System Diagnostics</h1>
            <button
                onClick={check}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
                {loading ? "Running Tests..." : "Run Diagnostics"}
            </button>

            {result && (
                <div className="mt-8 p-4 bg-gray-100 rounded border border-gray-300 overflow-auto">
                    <pre className="text-xs">{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
