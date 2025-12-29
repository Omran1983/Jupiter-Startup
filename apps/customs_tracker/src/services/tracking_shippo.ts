
import { ITrackingService, TrackingResult } from "./tracking";

export class ShippoTrackingService implements ITrackingService {

    // Lazy Client Initializer to prevent Build-Time Crashes
    private getClient() {
        const SHIPPO_TOKEN = process.env.SHIPPO_API_KEY!;

        // Dynamic Require to bypass Next.js Bundler aggressive pre-eval check for top-level vars
        const shippoPkg = require("shippo");

        // Handle strange bundling states (ESM vs CJS)
        // If shippoPkg is a function, use it. If it has .default, use that.
        const initShippo = typeof shippoPkg === 'function' ? shippoPkg : shippoPkg.default;

        if (!initShippo || typeof initShippo !== 'function') {
            // Fallback for extreme cases
            if (shippoPkg && typeof shippoPkg.Client === 'function') return new shippoPkg.Client(SHIPPO_TOKEN);

            console.error("[Shippo Init Error] Package Content:", shippoPkg);
            throw new Error("Shippo library could not be initialized. Check console.");
        }

        return initShippo(SHIPPO_TOKEN);
    }

    // Helper to map allowed status strings
    private mapStatus(shippoStatus: string): TrackingResult['status'] {
        // Shippo statuses: UNKNOWN, PRE_TRANSIT, TRANSIT, DELIVERED, RETURNED, FAILURE
        const s = shippoStatus?.toUpperCase() || "";
        if (s === "DELIVERED") return "delivered";
        if (s === "FAILURE" || s === "RETURNED" || s === "ERROR") return "exception";
        if (s === "TRANSIT") return "transit";
        if (s === "PRE_TRANSIT" || s === "UNKNOWN") return "pre_transit";

        // Heuristic for Customs
        if (s.includes("CUSTOMS") || s.includes("HELD")) return "customs_hold";

        return "transit"; // Default
    }

    async getStatus(carrier: string, trackingNumber: string): Promise<TrackingResult> {
        try {
            console.log(`[Shippo] Tracking ${carrier} ${trackingNumber}`);

            // Init client ONLY when needed (Runtime)
            const client = this.getClient();
            const track = await client.track.get_status(carrier, trackingNumber);

            if (!track || !track.tracking_history || track.tracking_history.length === 0) {
                // Return basic info if no history found
                return {
                    carrier,
                    trackingNumber,
                    status: "pre_transit", // Valid Type
                    rawStatus: "Carrier has no data yet",
                    location: "Unknown",
                    lastUpdated: new Date().toISOString(),
                    estimatedDelivery: "Unknown",
                    history: []
                };
            }

            // Map History safely to Interface
            const history = track.tracking_history.map((h: any) => ({
                date: h.status_date || new Date().toISOString(),
                status: h.status || "Unknown",
                details: h.status_details || ""
            }));

            // Get latest status
            const latest = history[0];
            const latestShippoStatus = track.tracking_status?.status || latest?.status || "UNKNOWN";

            // Analyze raw text for customs
            const rawStatusText = (track.tracking_status?.status_details || latest?.details || "").toLowerCase();
            let finalStatus = this.mapStatus(latestShippoStatus);

            // Override if text mentions customs
            if (rawStatusText.includes("customs") || rawStatusText.includes("held")) {
                finalStatus = "customs_hold";
            }

            return {
                carrier,
                trackingNumber,
                status: finalStatus,
                rawStatus: track.tracking_status?.status_details || latest?.details || "No details",
                location: track.address_to?.city || latest?.location || "Unknown", // Shippo might behave differently
                estimatedDelivery: track.eta || undefined,
                lastUpdated: track.tracking_status?.status_date || latest?.date || new Date().toISOString(),
                history
            };

        } catch (error: any) {
            console.error("Shippo Error:", error);
            // Fallback for API Errors
            return {
                carrier,
                trackingNumber,
                status: "exception",
                rawStatus: "Error: " + (error.message || "Could not reach carrier"),
                location: "Unknown",
                lastUpdated: new Date().toISOString(),
                history: []
            };
        }
    }
}
