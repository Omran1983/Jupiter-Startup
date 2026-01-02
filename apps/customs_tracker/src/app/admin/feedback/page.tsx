"use client";

import { useEffect, useState } from "react";
import { fetchFeedbackAdmin } from "../../../actions/admin_fetch"; // use relative import to be safe

export default function AdminFeedbackPage() {
    const [feedback, setFeedback] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const res = await fetchFeedbackAdmin();
        if (res.success) {
            setFeedback(res.data || []);
        } else {
            setError(res.error || "Failed to load");
        }
        setLoading(false);
    };

    return (
        <div className="p-8 max-w-6xl mx-auto bg-white min-h-screen text-slate-900">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Feedback / Leads</h1>
                <button
                    onClick={loadData}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                >
                    Refresh
                </button>
            </div>

            {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

            {loading ? (
                <div className="text-center py-20 text-slate-500">Loading leads...</div>
            ) : feedback.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-lg text-slate-500">
                    No feedback received yet.
                </div>
            ) : (
                <div className="border rounded-lg overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-100 border-b">
                            <tr>
                                <th className="p-4 font-semibold text-slate-600">Date</th>
                                <th className="p-4 font-semibold text-slate-600">Email</th>
                                <th className="p-4 font-semibold text-slate-600">Comment / Feedback</th>
                                <th className="p-4 font-semibold text-slate-600">Rating</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {feedback.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="p-4 text-slate-500 whitespace-nowrap">
                                        {new Date(item.created_at).toLocaleString()}
                                    </td>
                                    <td className="p-4 font-medium text-blue-600">
                                        <a href={`mailto:${item.email}`}>{item.email || '-'}</a>
                                    </td>
                                    <td className="p-4 text-slate-800 break-words max-w-sm">
                                        {item.comment}
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-bold">
                                            {item.rating} / 5
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
