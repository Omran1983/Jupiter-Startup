import { ITrackingService, TrackingResult } from "./tracking";

// Initialize Shippo with the Test Token (or Live Token from env)
// In production, use process.env.SHIPPO_API_KEY
const SHIPPO_TOKEN = process.env.SHIPPO_API_KEY!;
const shippo = require("shippo");
const client = shippo(SHIPPO_TOKEN);

export class ShippoTrackingService implements ITrackingService {
    async getStatus(carrier: string, trackingNumber: string): Promise<TrackingResult> {
        try {
            console.log(`[Shippo] Fetching status for ${carrier} - ${trackingNumber}`);

            // Shippo's "get_status" is usually for their transactions. 
            // For external tracking, we use the "tracks" endpoint.
            // We map our simplified carrier codes to Shippo's.
            // Common codes: "usps", "shippo", "dhl_express", "fedex", "ups"
            const carrierMap: Record<string, string> = {
                "dhl": "dhl_express",
                "fedex": "fedex",
                "ups": "ups",
                "usps": "usps"
            };

            const shippoCarrier = carrierMap[carrier.toLowerCase()] || carrier.toLowerCase();

            // Fetch tracking info
            const track = await client.track.get_status(shippoCarrier, trackingNumber);

            if (!track || !track.tracking_status) {
                throw new Error("Invalid tracking data received from carrier.");
            }

            // Map Shippo Status to Our Internal Status
            // Shippo: PRE_TRANSIT, TRANSIT, DELIVERED, RETURNED, FAILURE, UNKNOWN
            let status: "pre_transit" | "transit" | "customs_hold" | "delivered" | "exception" = "transit";
            const s = track.tracking_status.status;

            if (s === "PRE_TRANSIT") status = "pre_transit";
            else if (s === "DELIVERED") status = "delivered";
            else if (s === "RETURNED" || s === "FAILURE") status = "exception";
            else {
                // Check for specific "Customs" keywords in the history or status details
                // This is where our "Value Add" logic kicks in
                const historyDetails = track.tracking_history?.map(h => h.status_details?.toLowerCase() || "").join(" ") || "";
                const statusDetails = track.tracking_status.status_details?.toLowerCase() || "";

                if (
                    statusDetails.includes("customs") ||
                    statusDetails.includes("clearance") ||
                    statusDetails.includes("held") ||
                    historyDetails.includes("held in customs")
                ) {
                    status = "customs_hold";
                }
            }

            return {
                carrier: carrier,
                trackingNumber: trackingNumber,
                status: status,
                rawStatus: track.tracking_status.status_details || track.tracking_status.status,
                location: track.tracking_status.location ? `${track.tracking_status.location.city}, ${track.tracking_status.location.country}` : undefined,
                lastUpdated: track.tracking_status.status_date || new Date().toISOString(),
                estimatedDelivery: track.eta,
                history: track.tracking_history?.map((h: any) => ({
                    date: h.status_date,
                    status: h.status,
                    details: h.status_details
                })) || []
            };

        } catch (error: any) {
            console.error("[Shippo Error]", error);
            // Fallback for "First 10 Free" logic on error? 
            // Or just throw to show error UI
            throw new Error(error.message || "Failed to track package");
        }
    }
}
