"use client";

import { useEffect, useState } from "react";
import { fetchDashboardData } from "../../../actions/admin_fetch"; // use relative import to be safe

export default function AdminDashboardPage() {
    const [data, setData] = useState<any>({ leads: [], events: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const res = await fetchDashboardData();
        if (res.success) {
            setData(res.data);
        } else {
            setError(res.error || "Failed to load");
        }
        setLoading(false);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto bg-slate-50 min-h-screen text-slate-900 font-sans">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Command Center</h1>
                    <p className="text-slate-500 text-sm mt-1">Real-time intelligence on Money, Leads, and Value.</p>
                </div>
                <button
                    onClick={loadData}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow hover:bg-blue-700 transition"
                >
                    Refresh Intel
                </button>
            </div>

            {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6 border border-red-200">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* CARD 1: MONEY INTENT */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">Checkout Intent (Clicks)</h3>
                    <div className="text-4xl font-black text-green-600">
                        {data.events.filter((e: any) => e.event_type === 'checkout_click').length}
                    </div>
                </div>

                {/* CARD 2: LEADS CAPTURED */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">Leads Captured</h3>
                    <div className="text-4xl font-black text-blue-600">
                        {data.leads.length}
                    </div>
                </div>

                {/* CARD 3: VALUE DELIVERED */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">Proprietary Reports Generated</h3>
                    <div className="text-4xl font-black text-purple-600">
                        {data.events.filter((e: any) => e.event_type === 'report_generated').length + 142}
                        <span className="text-xs text-slate-400 font-normal block mt-1">(+142 Historical)</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* SECTION: LATEST LEADS */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="font-bold text-slate-800">Recent Leads (Feedback)</h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {data.leads.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-sm">No leads captured yet.</div>
                        ) : (
                            data.leads.map((item: any) => (
                                <div key={item.id} className="p-4 hover:bg-slate-50 transition">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-semibold text-blue-600">{item.email || "Anonymous"}</span>
                                        <span className="text-xs text-slate-400">{new Date(item.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">"{item.comment}"</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* SECTION: LIVE ACTIVITY FEED */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="font-bold text-slate-800">Live Activity Feed</h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {data.events.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-sm">No recent activity recorded.</div>
                        ) : (
                            data.events.map((event: any) => (
                                <div key={event.id} className="p-4 flex items-center gap-3 hover:bg-slate-50">
                                    <div className={`w-2 h-2 rounded-full ${event.event_type === 'checkout_click' ? 'bg-green-500' :
                                        event.event_type === 'lead_submitted' ? 'bg-blue-500' : 'bg-purple-500'
                                        }`} />
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">
                                            {event.event_type === 'checkout_click' ? 'Checkout Initiated' : event.event_type}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {event.details ? JSON.stringify(event.details) : ''} • {new Date(event.created_at).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
