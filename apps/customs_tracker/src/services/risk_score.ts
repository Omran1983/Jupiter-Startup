
import { TrackingResult } from "./tracking";

export interface RiskAssessment {
    score: number; // 0-100
    level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    reasons: string[];
    visualColor: string;
}

export class CustomsRiskCalculator {
    static assess(track: TrackingResult, destinationCountry: string): RiskAssessment {
        let score = 10; // Base Risk
        const reasons: string[] = [];

        // 1. Geography Risk (Based on known tough customs)
        const HIGH_RISK_COUNTRIES = ["BR", "IN", "RU", "ZA", "TR", "AR"]; // Brazil, India, Russia, South Africa...
        const MEDIUM_RISK_COUNTRIES = ["IT", "ES", "PT", "CN"]; // Italy (slow), Spain...

        if (HIGH_RISK_COUNTRIES.includes(destinationCountry)) {
            score += 40;
            reasons.push(`High-Risk Destination (${destinationCountry} is strict).`);
        } else if (MEDIUM_RISK_COUNTRIES.includes(destinationCountry)) {
            score += 20;
            reasons.push(`Medium-Risk Destination (${destinationCountry} can be slow).`);
        }

        // 2. Keyword Risk (Status Analysis)
        const raw = (track.rawStatus + " " + track.status).toLowerCase();

        if (raw.includes("seized") || raw.includes("prohibited")) {
            score += 100;
            reasons.push("Status keywords indicate SEIZURE.");
        }
        if (raw.includes("invoice") || raw.includes("document")) {
            score += 30;
            reasons.push("Missing Documentation flag detected.");
        }
        if (raw.includes("retention") || raw.includes("held")) {
            score += 25;
            reasons.push("Package is actively HELD.");
        }

        // 3. Duration Risk (Stuck Time)
        // Simple heuristic: if last update > 7 days ago AND status != delivered
        const lastUpdate = new Date(track.lastUpdated).getTime();
        const daysSinceUpdate = (Date.now() - lastUpdate) / (1000 * 60 * 60 * 24);

        if (track.status !== "delivered") {
            if (daysSinceUpdate > 14) {
                score += 40;
                reasons.push(`No movement for ${Math.floor(daysSinceUpdate)} days (Severe).`);
            } else if (daysSinceUpdate > 7) {
                score += 20;
                reasons.push(`No movement for ${Math.floor(daysSinceUpdate)} days.`);
            }
        }

        // Cap Score
        score = Math.min(score, 100);

        // Determine Level
        let level: RiskAssessment["level"] = "LOW";
        let color = "bg-green-100 text-green-800";

        if (score >= 80) { level = "CRITICAL"; color = "bg-red-800 text-white"; }
        else if (score >= 50) { level = "HIGH"; color = "bg-red-100 text-red-800"; }
        else if (score >= 30) { level = "MEDIUM"; color = "bg-yellow-100 text-yellow-800"; }

        return { score, level, reasons, visualColor: color };
    }
}
