import { jsPDF } from "jspdf";
import { NextResponse } from "next/server";

export async function GET() {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.setTextColor(0, 0, 0);
    doc.text("Official Anti-Dispute Guide", 20, 30);

    doc.setFontSize(12);
    doc.text("This is your exclusive guide to winning Chargeback & INR disputes.", 20, 50);
    doc.text("Property of Customs Tracker Intelligence.", 20, 60);

    doc.setFillColor(240, 240, 240);
    doc.rect(20, 70, 170, 100, "F");

    doc.setFontSize(16);
    doc.setTextColor(50, 50, 50);
    doc.text("Strategic Defense Protocol:", 30, 90);

    doc.setFontSize(12);
    doc.text("1. Always upload Chain of Custody reports to PayPal.", 30, 110);
    doc.text("2. Use the 'Customs Hold' status as legal proof of transit.", 30, 120);
    doc.text("3. Pre-emptively email customers with their Risk Score.", 30, 130);

    const pdfBuffer = doc.output("arraybuffer");

    return new NextResponse(pdfBuffer, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": 'attachment; filename="Anti_Dispute_Guide.pdf"'
        }
    });
}
