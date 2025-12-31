
import { Shippo } from "shippo";
import { ITrackingService, TrackingResult } from "./tracking";

export class ShippoTrackingService implements ITrackingService {

    private getClient() {
        const SHIPPO_TOKEN = process.env.SHIPPO_API_KEY;
        if (!SHIPPO_TOKEN) {
            console.error("Missing SHIPPO_API_KEY env var");
            throw new Error("Tracking Service Misconfigured (Missing Credentials)");
        }

        try {
            // New SDK Syntax (Speakeasy / v2+)
            // Explicitly handling the "ShippoToken " prefix requirement for v2+
            const token = SHIPPO_TOKEN.startsWith("ShippoToken") ? SHIPPO_TOKEN : `ShippoToken ${SHIPPO_TOKEN}`;
            const client = new Shippo({ apiKeyHeader: token });
            return client as any;
        } catch (e) {
            console.error("Shippo Init Failed:", e);
            throw new Error("Tracking API Initialization Failed");
        }
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

            // 1. Primary Attempt
            const client = this.getClient();
            let track = await client.track.get_status(carrier, trackingNumber);

            // 2. Deep Scan Logic (Auto-Detect)
            // If primary carrier has NO history (e.g. USPS waiting for Yanwen), try fallbacks
            if (!track || !track.tracking_history || track.tracking_history.length === 0) {
                console.log("[Shippo] Primary carrier empty. Initiating Deep Scan...");
                const FALLBACKS = ['yanwen', 'china-post', '4px', 'cainiao']; // Common dropshipping carriers

                for (const fallback of FALLBACKS) {
                    if (fallback === carrier) continue; // Skip explicit duplicate
                    try {
                        const deepTrack = await client.track.get_status(fallback, trackingNumber);
                        if (deepTrack && deepTrack.tracking_history && deepTrack.tracking_history.length > 0) {
                            console.log(`[Shippo] Details found via ${fallback}!`);
                            track = deepTrack; // Swap to the better data provider
                            carrier = fallback; // Update reported carrier
                            break; // Stop scanning once we find data
                        }
                    } catch (ignore) {
                        // Fallback failed, continue to next
                    }
                }
            }

            if (!track || !track.tracking_history || track.tracking_history.length === 0) {
                // Return basic info if no history found after all attempts
                return {
                    carrier,
                    trackingNumber,
                    status: "pre_transit", // Valid Type
                    rawStatus: "Carrier has no data yet (Deep Scan Complete)",
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
                details: h.status_details || "",
                location: h.location?.city || h.location?.country || "" // Robust location mapping
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
                carrier, // Might be the fallback carrier now
                trackingNumber,
                status: finalStatus,
                rawStatus: track.tracking_status?.status_details || latest?.details || "No details",
                location: track.address_to?.city || latest?.location || "Unknown",
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
