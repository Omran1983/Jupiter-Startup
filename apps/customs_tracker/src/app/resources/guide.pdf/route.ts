import { jsPDF } from "jspdf";
import { NextResponse } from "next/server";

export async function GET() {
    const doc = new jsPDF();

    // PAGE 1: COVER & STRATEGY
    doc.setFillColor(41, 128, 185); // Blue
    doc.rect(0, 0, 210, 40, "F");

    doc.setFontSize(26);
    doc.setTextColor(255, 255, 255);
    doc.text("OFFICIAL ANTI-DISPUTE GUIDE", 20, 25);

    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text("The Merchant's Playbook for Winning 'Item Not Received'", 20, 35);

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(12);
    doc.text("Generated for: Premium Merchant", 20, 55);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 55);

    doc.setLineWidth(0.5);
    doc.line(20, 60, 190, 60);

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("PART 1: THE EVIDENCE STANDARD", 20, 75);

    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    const text1 = "Payment processors (Stripe/PayPal) do not care about 'In Transit' screenshots. They care about 'Chain of Custody'. To win an INR (Item Not Received) dispute, you must prove the package is in the legal possession of a registered logistics entity.";
    doc.text(doc.splitTextToSize(text1, 170), 20, 85);

    doc.setFillColor(240, 240, 240);
    doc.rect(20, 105, 170, 35, "F");
    doc.setFontSize(12);
    doc.setTextColor(200, 0, 0); // Red
    doc.text("CRITICAL MISTAKE:", 25, 115);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    const mistakeText = "Submitting a tracking link that shows 'Label Created' or 'Handed Over' for more than 5 days. This signals 'Lost' to the arbitrator.";
    doc.text(doc.splitTextToSize(mistakeText, 160), 25, 122);

    const solutionText = "SOLUTION: Use Customs Tracker to generate a 'Customs Hold' certificate.";
    doc.text(doc.splitTextToSize(solutionText, 160), 25, 132);

    // PAGE 2: TEMPLATES
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("PART 2: COPY-PASTE WINNING SCRIPTS", 20, 155);

    doc.setFontSize(12);
    doc.setTextColor(41, 128, 185);
    doc.text("Scenario A: Customer asks 'Where is my order?' (Pre-Dispute)", 20, 165);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(150);
    doc.rect(20, 170, 170, 50);
    const email1 = "Dear Customer,\n\nYour order is NOT lost. It has been flagged for a standard Level-1 Safety Scan at the destination border (Logistics Code: HS-8501). This is valid proof of transit.\n\nThe carrier accepts legal liability for delivery. We have attached the Official Chain of Custody record for your peace of mind.\n\nExpected Release: 48-72 Hours.";
    doc.text(doc.splitTextToSize(email1, 160), 25, 177);

    doc.setFontSize(12);
    doc.setTextColor(41, 128, 185);
    doc.text("Scenario B: Responding to PayPal Dispute API", 20, 235);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.rect(20, 240, 170, 40);
    const email2 = "Evidence Submission:\nThe shipment is currently in the custody of [Carrier Name]. It is pending Customs Release. This delay is a regulatory procedure, not a failure to fulfill. Attached is the independent tracking audit certifying location.";
    doc.text(doc.splitTextToSize(email2, 160), 25, 247);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Copyright © 2026 Customs Tracker Intelligence. Confidential.", 100, 285, { align: "center" });

    const pdfBuffer = doc.output("arraybuffer");

    return new NextResponse(pdfBuffer, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": 'attachment; filename="Anti_Dispute_Guide.pdf"'
        }
    });
}
