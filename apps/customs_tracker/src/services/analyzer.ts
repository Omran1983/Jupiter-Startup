import { TrackingResult } from "./tracking";

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
}

export class CustomsAnalyzer {
    analyze(result: TrackingResult, country: string): AnalysisResult {
        // --- Scenarios ---

        // 1. Customs Hold
        if (result.status === "customs_hold") {
            return {
                consumerStatus: "Processing at International Customs (Routine)",
                severity: "medium",
                estimatedDelay: "3-12 Days (Average)",
                actionItems: [
                    "Do NOT refund the customer yet.",
                    "Check tracking again in 48 hours for a 'Released' status.",
                    "Monitor for 'Seized' or 'Duty Unpaid' notices (rare).",
                ],
                refundAdvice:
                    "It is premature to refund. Most packages clear within 10 days. Refunding now risks total loss if the package is delivered next week.",
                emailTemplate: {
                    subject: "Update on your order: currently clearing customs",
                    body: `Hi [Customer Name],\n\nI checked the status of your order. It is currently moving through standard customs clearance in ${country}. This is a routine manufacturing/import step and usually takes a few business days.\n\nEverything looks normal. I will keep an eye on it and update you if it takes longer than the average 12-day window.\n\nThanks,\n[Your Name]`,
                },
            };
        }

        // 2. Transporting
        if (result.status === "transit") {
            return {
                consumerStatus: "Moving through logistics network",
                severity: "low",
                estimatedDelay: "On Schedule",
                actionItems: ["No action needed."],
                refundAdvice: "Do not refund. Package is moving.",
                emailTemplate: undefined,
            };
        }

        // 3. Delivered
        if (result.status === "delivered") {
            return {
                consumerStatus: "Delivered",
                severity: "low",
                estimatedDelay: "None",
                actionItems: ["Verify delivery proof if customer claims non-receipt."],
                refundAdvice: "Item delivered. Refund only if product is defective.",
                emailTemplate: {
                    subject: "Your order has arrived!",
                    body: `Hi [Customer Name],\n\nGood news! Your order was marked delivered at ${result.lastUpdated}.\n\nEnjoy!\n[Your Name]`,
                },
            };
        }

        // Default Fallback
        return {
            consumerStatus: "Status Unknown",
            severity: "medium",
            estimatedDelay: "Unknown",
            actionItems: ["Contact Carrier support for details."],
            refundAdvice: "Wait for carrier update.",
        };
    }
}
