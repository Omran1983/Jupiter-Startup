
import { TrackingResult } from "./tracking";
import { CustomsRiskCalculator, RiskAssessment } from "./risk_score";

export interface AnalysisResult {
    consumerStatus: string;
    severity: "low" | "medium" | "high";
    estimatedDelay: string;
    actionItems: string[];
    emailTemplate?: {
        subject: string;
        body: string;
    };
    refundAdvice: string;
    riskAssessment: RiskAssessment;
}

export class CustomsAnalyzer {
    analyze(result: TrackingResult, country: string): AnalysisResult {
        const raw = (result.rawStatus || "").toLowerCase();
        const details = result.history.map(h => (h.details || "").toLowerCase()).join(" ");
        const fullText = `${raw} ${details}`;

        const riskAssessment = CustomsRiskCalculator.assess(result, country);

        // --- AUTHENTIC SCENARIO 1: MISSING INVOICE ---
        if (fullText.includes("invoice") || fullText.includes("documentation") || fullText.includes("paperwork")) {
            return {
                consumerStatus: "Held - Documentation Missing",
                severity: "high",
                estimatedDelay: "Indefinite until resolved",
                actionItems: [
                    "The Customs Authority needs a Commercial Invoice.",
                    "You (the buyer) usually cannot provide this.",
                    "You must ask the Seller to send it to the carrier."
                ],
                refundAdvice: "Ask seller to intervene. If they fail, chargeback.",
                emailTemplate: {
                    subject: "Urgent: Customs requires Commercial Invoice for Order #[Order ID]",
                    body: `Hi [Seller Name],\n\nI am contacting you regarding my order #[Order ID] (Tracking: ${result.trackingNumber}).\n\nThe carrier has flagged that the shipment is HELD at customs due to a missing or incorrect Commercial Invoice.\n\nPlease provide the invoice to the carrier immediately so the package can be released. If this is not resolved by [Date], I will have to request a refund.\n\nPlease confirm when this is done.\n\nThanks,\n[My Name]`
                },
                riskAssessment
            };
        }

        // --- AUTHENTIC SCENARIO 2: RESTRICTED/PROHIBITED ---
        if (fullText.includes("prohibited") || fullText.includes("seized") || fullText.includes("confiscated")) {
            return {
                consumerStatus: "Seized - Prohibited Item",
                severity: "high",
                estimatedDelay: "Permanent Stop",
                actionItems: [
                    "Item has been seized by Border Control.",
                    "It will not be delivered.",
                    "Contact seller for refund immediately."
                ],
                refundAdvice: "Claim refund immediately. Item is gone.",
                emailTemplate: {
                    subject: "Refund Request: Order #[Order ID] Seized by Customs",
                    body: `Hi [Seller Name],\n\nMy order (Tracking: ${result.trackingNumber}) has been marked as SEIZED/PROHIBITED by customs.\n\nSince I cannot receive this item, I am requesting a full refund immediately.\n\nPlease process this refund within 24 hours.\n\nRegards,\n[My Name]`
                },
                riskAssessment
            };
        }

        // --- AUTHENTIC SCENARIO 3: GENERIC CUSTOMS HOLD ---
        if (result.status === "customs_hold" || fullText.includes("customs") || fullText.includes("clearance") || fullText.includes("tax") || fullText.includes("duty")) {
            return {
                consumerStatus: "Processing at International Customs",
                severity: "medium",
                estimatedDelay: "3-12 Days (Average)",
                actionItems: [
                    "Wait 3-5 more days.",
                    "This is standard processing.",
                    "Draft a 'Nudge' email to the seller just in case."
                ],
                refundAdvice: "Too early to refund. Wait 10 days.",
                emailTemplate: {
                    subject: "Inquiry: Status of Order #[Order ID]",
                    body: `Hi [Seller Name],\n\nI noticed my order (Tracking: ${result.trackingNumber}) has been stuck in 'Customs Clearance' for several days.\n\nIs there any documentation required from my side? Or do I just need to wait?\n\nI would appreciate a check on your end.\n\nThanks,\n[My Name]`
                },
                riskAssessment
            };
        }

        // --- SCENARIO 4: DELIVERED ---
        if (result.status === "delivered" || fullText.includes("delivered")) {
            return {
                consumerStatus: "Delivered",
                severity: "low",
                estimatedDelay: "None",
                actionItems: ["Check mailbox/porch.", "Ask neighbors."],
                refundAdvice: "Item marked delivered. Hard to refund.",
                emailTemplate: {
                    subject: "Question regarding delivered Order #[Order ID]",
                    body: `Hi [Seller Name],\n\nThe tracking shows delivered, but I have a question regarding the contents...\n\n[Type Question Here]\n\nThanks,\n[My Name]`
                },
                riskAssessment
            };
        }

        // --- SCENARIO 5: TRANSIT/DEFAULT ---
        return {
            consumerStatus: "In Transit",
            severity: "low",
            estimatedDelay: "On Schedule",
            actionItems: ["No action needed. moving normally."],
            refundAdvice: "Do not refund. Package is moving.",
            emailTemplate: undefined,
            riskAssessment
        };
    }
}
