import { ShippoTrackingService } from "@/services/tracking_shippo";
import { CustomsAnalyzer } from "@/services/analyzer";
import { AlertTriangle, CheckCircle, Clock, Copy, Lock } from "lucide-react";
import DownloadEvidenceButton from "@/components/DownloadEvidenceButton";

export const dynamic = 'force-dynamic';

// In real app, we fetch from DB. For now, we re-run logic.
async function getReport(carrier: string, trackingNumber: string, country: string) {
    // try {
    const tracker = new ShippoTrackingService();
    const analyzer = new CustomsAnalyzer();
    const trackResult = await tracker.getStatus(carrier, trackingNumber);
    // Merge the analyzer result with raw tracking data so the button has access to history
    // We append the raw tracking object to the analyzer result for the PDF generator
    return { ...analyzer.analyze(trackResult, country), rawData: trackResult };
    // } catch (e) {
    //     console.error("Tracking Failed", e);
    //     return null;
    // }
}

export default async function ReportPage(props: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ carrier: string; tracking: string; country: string; paid?: string }>;
}) {
    const searchParams = await props.searchParams;
    let report;
    let isFromDb = false;

    try {
        if (searchParams.carrier && searchParams.tracking) {
            // A. STATELESS MODE: Live re-run
            report = await getReport(searchParams.carrier, searchParams.tracking, searchParams.country);
        } else {
            // B. STATEFUL MODE: Fetch from DB (Clean URL support)
            const { createClient } = await import("@supabase/supabase-js");
            const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
            const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

            if (sbUrl && sbKey) {
                const supabase = createClient(sbUrl, sbKey);
                const id = (await props.params).id;

                const { data, error } = await supabase
                    .from("runs")
                    .select("output_summary, input_payload")
                    .eq("id", id)
                    .single();

                if (data) {
                    const storedHistory = data.output_summary?.tracking?.history || [];

                    if (storedHistory.length > 0) {
                        // HAPPY PATH: Cache is good
                        report = {
                            ...data.output_summary.analysis,
                            rawData: data.output_summary.tracking
                        };
                        isFromDb = true;
                    } else if (data.input_payload) {
                        // SELF-HEALING: Cache is empty (from outage), but we have inputs. Re-Run!
                        console.log(`[Self-Heal] Re-running empty report ${id}...`);
                        const { carrier, trackingNumber, destinationCountry } = data.input_payload;

                        // Force a fresh run
                        report = await getReport(carrier, trackingNumber, destinationCountry);
                    }
                }
            }
        }
    } catch (e) {
        // Fallback for demo/invalid numbers
        console.error("Report Load Error:", e);
        report = null;
    }

    if (!report) {
        // DEBUG: Check which key is being used (Safe)
        const usingServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
        const debugInfo = usingServiceKey ? "Service Role (Correct)" : "Anon Key (WRONG - RLS Blocked)";

        return (
            <div className="w-full max-w-2xl p-8 bg-gray-50 border border-gray-200 rounded-xl text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Report Not Found</h2>
                    <p className="text-gray-600 max-w-sm mx-auto mt-2">
                        We couldn't retrieve this specific report. It may have expired or the link is incomplete.
                    </p>
                    <div className="mt-4 p-3 bg-white border border-gray-200 rounded text-xs font-mono text-left text-gray-500 overflow-auto">
                        <p className="font-bold text-gray-800 mb-1">Diagnosis Info:</p>
                        <p>ID: {(await props.params).id}</p>
                        <p>Key Mode: <span className={usingServiceKey ? "text-green-600 font-bold" : "text-red-600 font-bold"}>{debugInfo}</span></p>
                        <p>Timestamp: {new Date().toISOString()}</p>
                    </div>
                </div>
                <div className="pt-2">
                    <a
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition w-full sm:w-auto"
                    >
                        Start New Search
                    </a>
                </div>
            </div>
        );
    }
    const isPaid = searchParams.paid === "true"; // Mock Payment Check

    const severityKey = (report.severity || "low") as "low" | "medium" | "high";

    const severityColor = {
        low: "bg-green-100 text-green-800 border-green-200",
        medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
        high: "bg-red-100 text-red-800 border-red-200",
    }[severityKey];

    const Icon = {
        low: CheckCircle,
        medium: Clock,
        high: AlertTriangle
    }[severityKey];

    return (
        <div className="w-full max-w-2xl space-y-6 animate-in fade-in duration-500">

            {/* 1. The Result (Always Free) - The Hook */}
            <div className={`p-6 rounded-xl border ${severityColor} flex items-start gap-4 shadow-sm relative`}>
                <Icon className="w-8 h-8 flex-shrink-0" />
                <div className="flex-1">
                    <h2 className="text-xl font-bold">{report.consumerStatus}</h2>
                    <p className="text-sm opacity-90 mt-1">Estimating {report.estimatedDelay} delay.</p>
                </div>
                {/* PDF Button */}
                <div className="absolute top-6 right-6">
                    {/* @ts-ignore - rawData is injected above */}
                    <DownloadEvidenceButton report={report.rawData} />
                </div>
            </div>

            {/* 1.5 RISK SCORE CARD (New) */}
            <div className={`p-4 rounded-xl border flex justify-between items-center ${report.riskAssessment.visualColor}`}>
                <div>
                    <div className="text-xs font-bold uppercase tracking-wider opacity-80">Customs Risk Score</div>
                    <div className="text-2xl font-black">{report.riskAssessment.score}/100</div>
                </div>
                <div className="text-right">
                    <div className="font-bold">{report.riskAssessment.level}</div>
                    <div className="text-xs opacity-80 max-w-[150px] leading-tight">
                        {report.riskAssessment.reasons[0] || "Standard Processing"}
                    </div>
                </div>
            </div>

            {/* 1.8 TRACKING HISTORY (New Request) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                <h3 className="font-bold text-gray-900 mb-4">Tracking Timeline</h3>
                {/* @ts-ignore - rawData is checked */}
                {(report.rawData.history && report.rawData.history.length > 0) ? (
                    <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
                        {/* @ts-ignore */}
                        {report.rawData.history.slice(0, 5).map((event: any, i: number) => (
                            <div key={i} className="relative">
                                <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white ring-1 ring-blue-100"></div>
                                <div className="text-sm font-bold text-gray-900">{event.status}</div>
                                <div className="text-xs text-gray-500 mb-1">
                                    {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}
                                    {event.location && ` • ${event.location}`}
                                </div>
                                <div className="text-sm text-gray-600 leading-relaxed">{event.details}</div>
                            </div>
                        ))}
                        {/* @ts-ignore */}
                        {report.rawData.history.length > 5 && (
                            <div className="text-xs text-gray-400 italic pt-2">
                                + {report.rawData.history.length - 5} more updates...
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 italic">No detailed tracking events found.</p>
                )}
            </div>

            {/* 2. Action Plan (Free Preview) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                <h3 className="font-bold text-gray-900 mb-4">Action Plan</h3>
                <ul className="space-y-3">
                    {report.actionItems.map((item: string, i: number) => (
                        <li key={i} className="flex gap-3 text-gray-700">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                                {i + 1}
                            </span>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            {/* 3. The Value (Gated) - The Solution */}
            {report.emailTemplate && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            Reply to Customer
                            {!isPaid && <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">PREMIUM</span>}
                        </h3>
                    </div>

                    {isPaid ? (
                        // PAID VIEW
                        <div className="p-6">
                            <div className="font-mono text-sm bg-blue-50 p-4 rounded-lg border border-blue-100 text-gray-700 whitespace-pre-wrap">
                                <div className="font-bold mb-2 text-blue-800">Subject: {report.emailTemplate.subject}</div>
                                {report.emailTemplate.body}
                            </div>
                            <button className="mt-4 w-full py-2 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-black transition-colors flex items-center justify-center gap-2">
                                <Copy className="w-4 h-4" /> Copy Text
                            </button>
                        </div>
                    ) : (
                        // LOCKED VIEW (Blur)
                        <div className="p-6 relative">
                            <div className="font-mono text-sm text-gray-400 blur-sm select-none">
                                <div className="font-bold mb-2">Subject: Re: Update on your shipment #12345</div>
                                Hi [Customer], just wanted to give you a quick update on your package.
                                It is currently clearing customs which is a standard procedure.
                                I've attached the tracking details...
                            </div>

                            {/* Paywall Overlay */}
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
                                <Lock className="w-8 h-8 text-gray-900 mb-3" />
                                <h4 className="font-bold text-lg text-gray-900">Unlock the Perfect Response</h4>
                                <p className="text-sm text-gray-600 max-w-xs mb-4">
                                    Don't say the wrong thing and trigger a chargeback. Get the exact template tailored to this status.
                                </p>
                                <a
                                    href={`/report/${(await props.params).id}?carrier=${searchParams.carrier}&tracking=${searchParams.tracking}&country=${searchParams.country}&paid=true`}
                                    className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform active:scale-95 flex items-center gap-2"
                                >
                                    Unlock for $9 (Simulated)
                                </a>
                                <p className="text-xs text-gray-400 mt-2">One-time fee. 100% Guarantee.</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="text-center">
                <a href="/" className="text-sm text-gray-400 hover:text-gray-900 transition-colors">
                    Check Another Package
                </a>
            </div>

        </div>
    );
}
