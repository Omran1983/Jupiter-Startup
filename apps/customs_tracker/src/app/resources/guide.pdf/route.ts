import { jsPDF } from "jspdf";
import { NextResponse } from "next/server";

export async function GET() {
    const doc = new jsPDF();

    // --- PAGE 1: STRATEGY & AUTHORITY ---
    doc.setFillColor(41, 128, 185); // Professional Blue
    doc.rect(0, 0, 210, 40, "F");

    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text("OFFICIAL ANTI-DISPUTE GUIDE", 20, 20);
    doc.setFontSize(12);
    doc.text("The Merchant's Playbook for Winning 'Item Not Received' (INR)", 20, 32);

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    doc.text(`Generated for: Premium Merchant Example | Date: ${new Date().toLocaleDateString()}`, 20, 50);

    doc.setLineWidth(0.5);
    doc.line(20, 55, 190, 55);

    // Section 1: The Evidence Standard
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("1. THE 'CHAIN OF CUSTODY' STANDARD", 20, 70);

    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    const text1 = "Payment processors (Stripe, PayPal, Adyen) do not accept simple tracking screenshots as definitive proof. To win a dispute, you must demonstrate 'Continuous Chain of Custody'—legal proof that the package is under the active control of a regulated logistics entity.";
    doc.text(doc.splitTextToSize(text1, 170), 20, 80);

    // Critical Mistake Box
    doc.setFillColor(245, 230, 230); // Light Red
    doc.rect(20, 100, 170, 40, "F");
    doc.setFontSize(12);
    doc.setTextColor(180, 0, 0);
    doc.text("CRITICAL ERROR: 'Label Created'", 25, 110);
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    const mistake = "Submitting a tracking number that remains in 'Label Created' or 'Handed Over' status for >5 days is an automatic loss. It implies the package was never scanned by the carrier.";
    doc.text(doc.splitTextToSize(mistake, 160), 25, 118);
    doc.setFont("helvetica", "bold");
    doc.text("THE FIX: Use Customs Tracker to generate a 'Customs Hold' certificate, which proves the item is physically held by government authorities, stopping the dispute clock.", 25, 130);
    doc.setFont("helvetica", "normal");

    // --- PAGE 2: WINNING SCRIPTS ---
    doc.addPage();
    doc.setFontSize(16);
    doc.text("2. STRATEGIC COMMUNICATION SCRIPTS", 20, 20);

    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text("Use these exact templates to de-escalate customers BEFORE they file a dispute.", 20, 30);

    // Script A
    doc.setFillColor(230, 240, 250); // Light Blue
    doc.rect(20, 40, 170, 60, "F");
    doc.setFontSize(12);
    doc.setTextColor(0, 50, 150);
    doc.text("SCRIPT A: The 'Pre-emptive Strike' (Send at Day 5)", 25, 50);
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const scriptA = "Subject: Your Order #1234 - Important Safety Scan Update\n\nDear Customer,\n\nYour order is NOT lost. It has been selected for a standard Level-1 Safety Scan at the border (Logistics Code: HS-8501). This is a good thing—it verifies the authenticity of your goods.\n\nThe carrier accepts legal liability for delivery. We have attached the Official Chain of Custody record for your peace of mind.\n\nExpected Release: 48-72 Hours.";
    doc.text(doc.splitTextToSize(scriptA, 160), 25, 60);

    // Script B
    doc.setFillColor(230, 240, 250);
    doc.rect(20, 110, 170, 60, "F");
    doc.setFontSize(12);
    doc.setTextColor(0, 50, 150);
    doc.text("SCRIPT B: Responding to PayPal Dispute API", 25, 120);
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const scriptB = "Evidence Submission:\nThe shipment is currently in the custody of [Carrier Name] (Regulated Entity). It is pending Customs Release. This delay is a Force Majeure event caused by regulatory procedure, not a failure to fulfill.\n\nAttached is the independent tracking audit certifying the exact GPS location and Custodian ID.";
    doc.text(doc.splitTextToSize(scriptB, 160), 25, 130);

    // --- PAGE 3: CHARGEBACK SHIELD CHECKLIST ---
    doc.addPage();
    doc.setFontSize(16);
    doc.text("3. THE CHARGEBACK SHIELD CHECKLIST", 20, 20);

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text("Before submitting evidence, ensure you have these 5 data points:", 20, 30);

    const checklist = [
        "[ ] Weight Verification: Does the carrier scan match your shipping weight?",
        "[ ] Delivery GPS: Do you have the exact coordinates of the delivery scan?",
        "[ ] Service Code: Are you using a 'Tracked' service (not untracked economy)?",
        "[ ] HS Code Match: Does the customs declaration match the product sold?",
        "[ ] Risk Score: Is the destination country considered High Risk (Score > 60)?"
    ];

    let y = 45;
    doc.setFontSize(12);
    checklist.forEach(item => {
        doc.text(item, 25, y);
        y += 15;
    });

    doc.setFillColor(240, 240, 240);
    doc.rect(20, 130, 170, 40, "F");
    doc.setFontSize(12);
    doc.text("Use Customs Tracker Intelligence to automatically Audit these points.", 30, 145);
    doc.setFontSize(10);
    doc.text(">> Access real-time reports: Log in to your Dashboard", 30, 155);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Copyright © 2026 Customs Tracker Intelligence. Confidential & Proprietary.", 105, 280, { align: "center" });

    const pdfBuffer = doc.output("arraybuffer");

    return new NextResponse(pdfBuffer, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": 'attachment; filename="Anti_Dispute_Guide.pdf"'
        }
    });
}
