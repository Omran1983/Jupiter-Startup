"use client";

import { FileText } from "lucide-react";
import { generateEvidenceReport, TrackingResult } from "@/services/pdfGenerator";

export default function DownloadEvidenceButton({ report }: { report: any }) {
    // Cast report to match TrackingResult if needed, or keep strictly typed

    return (
        <button
            onClick={() => generateEvidenceReport(report)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-bold border border-blue-200"
        >
            <FileText className="w-4 h-4" />
            Download Official Proof
        </button>
    );
}
