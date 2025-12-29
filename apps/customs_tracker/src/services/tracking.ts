import { z } from "zod";

// --- Types ---
export interface TrackingResult {
    carrier: string;
    trackingNumber: string;
    status: "pre_transit" | "transit" | "customs_hold" | "delivered" | "exception";
    rawStatus: string; // The raw text from carrier
    location?: string;
    lastUpdated: string; // ISO date
    estimatedDelivery?: string;
    history: Array<{ date: string; status: string; details: string }>;
}

export interface ITrackingService {
    getStatus(carrier: string, trackingNumber: string): Promise<TrackingResult>;
}

// --- Mock Implementation ---
export class MockTrackingService implements ITrackingService {
    async getStatus(carrier: string, trackingNumber: string): Promise<TrackingResult> {
        // Simulate latency
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Scenario 1: The Happy Path (Delivered)
        if (trackingNumber.endsWith("001")) {
            return {
                carrier,
                trackingNumber,
                status: "delivered",
                rawStatus: "Delivered",
                location: "Austin, TX",
                lastUpdated: new Date().toISOString(),
                history: [
                    { date: new Date().toISOString(), status: "Delivered", details: "Left at front porch" },
                ],
            };
        }

        // Scenario 2: The Logic We Need (Stuck in Customs)
        if (trackingNumber.endsWith("002") || trackingNumber.endsWith("STUCK")) {
            return {
                carrier,
                trackingNumber,
                status: "customs_hold",
                rawStatus: "Held in Customs - Awaiting Clearance",
                location: "ISC NEW YORK NY (USPS)",
                lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
                history: [
                    {
                        date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
                        status: "Held in Customs",
                        details: "Your item is being processed by United States Customs.",
                    },
                    {
                        date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
                        status: "Inbound Into Customs",
                        details: "Inbound Into Customs",
                    },
                ],
            };
        }

        // Default: In Transit
        return {
            carrier,
            trackingNumber,
            status: "transit",
            rawStatus: "In Transit to Next Facility",
            lastUpdated: new Date().toISOString(),
            history: [],
        };
    }
}
