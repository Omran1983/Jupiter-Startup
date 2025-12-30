import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface TrackingResult {
    carrier: string;
    trackingNumber: string;
    status: "delivered" | "transit" | "exception" | "pre_transit" | "customs_hold";
    rawStatus: string;
    location: string;
    estimatedDelivery?: string;
    lastUpdated: string;
    history: { date: string; status: string; details: string }[];
}

export const generateEvidenceReport = (report: TrackingResult) => {
    const doc = new jsPDF();

    // -- Header --
    doc.setFillColor(33, 33, 33); // Dark Gray Banner
    doc.rect(0, 0, 210, 30, "F");

    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text("CHAIN OF CUSTODY REPORT", 105, 20, { align: "center" });

    // -- Sub-Header --
    doc.setFontSize(10);
    doc.setTextColor(200, 200, 200);
    doc.text("OFFICIAL TRACKING EVIDENCE // DO NOT MODIFY", 105, 27, { align: "center" });

    // -- Status & Metadata (Box) --
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`Tracking #: ${report.trackingNumber}`, 14, 45);

    doc.setFontSize(11);
    doc.text(`Carrier: ${report.carrier.toUpperCase()}`, 14, 52);
    doc.text(`Latest Status: ${report.rawStatus}`, 14, 59);
    doc.text(`Location: ${report.location}`, 14, 66);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 73);

    // -- Stamp --
    const stampColor = report.status === "delivered" ? [46, 125, 50] : [230, 81, 0]; // Green or Orange
    doc.setTextColor(stampColor[0], stampColor[1], stampColor[2]);
    doc.setFontSize(30);
    doc.text(report.status.toUpperCase().replace("_", " "), 150, 60, { angle: -15, align: "center" });

    // Draw box around stamp
    doc.setDrawColor(stampColor[0], stampColor[1], stampColor[2]);
    doc.setLineWidth(1);
    doc.rect(120, 40, 60, 30);

    // -- The Table (History) --
    const tableData = report.history.map((h) => [
        new Date(h.date).toLocaleString(),
        h.status,
        h.details
    ]);

    autoTable(doc, {
        head: [["Timestamp", "Status", "Details"]],
        body: tableData,
        startY: 85,
        theme: "grid",
        headStyles: { fillColor: [50, 50, 50], textColor: 255 },
        styles: { fontSize: 9 }
    });

    // -- Footer --
    const pageHeight = doc.internal.pageSize.height;
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text("Verified by Customs Status Tracker (A-One Global Resourcing)", 105, pageHeight - 10, { align: "center" });
    doc.text("https://customs-tracker.vercel.app", 105, pageHeight - 6, { align: "center" });

    // -- Download --
    doc.save(`Evidence_${report.trackingNumber}.pdf`);
};
