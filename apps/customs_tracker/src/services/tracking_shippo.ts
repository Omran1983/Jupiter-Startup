
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

    async getStatus(carrier: string, trackingNumber: string): Promise<TrackingResult> {
        try {
            console.log(`[Shippo] Tracking ${carrier} ${trackingNumber}`);

            // Init client ONLY when needed (Runtime)
            const client = this.getClient();
            const track = await client.track.get_status(carrier, trackingNumber);

            if (!track || !track.tracking_history) {
                // Return basic info if no history found
                return {
                    trackingNumber,
                    status: "Status Unavailable",
                    statusDetails: "Carrier has no data yet.",
                    carrier,
                    eta: "Unknown",
                    location: "Unknown",
                    history: []
                };
            }

            // Map History safely with explicit types
            const history = track.tracking_history.map((h: any) => ({
                status: h.status || "Unknown",
                details: h.status_details || "",
                location: h.location ? `${h.location.city || ''}, ${h.location.country || ''}` : "Unknown",
                timestamp: h.status_date || new Date().toISOString()
            }));

            // Get latest status
            const latest = history.length > 0 ? history[0] : null;

            // Build Context String
            // We join all status details to analyze the "mood" of the shipment
            const historyDetails = track.tracking_history?.map((h: any) => h.status_details?.toLowerCase() || "").join(" ") || "";

            return {
                trackingNumber,
                status: latest?.status || "Unknown",
                statusDetails: latest?.details || "No details provided",
                carrier,
                eta: track.eta || "Pending",
                location: latest?.location || "Unknown",
                history
            };

        } catch (error: any) {
            console.error("Shippo Error:", error);
            // Fallback for API Errors
            return {
                trackingNumber,
                status: "Error",
                statusDetails: "Could not reach carrier API. " + (error.message || ""),
                carrier,
                eta: "Unknown",
                location: "Unknown",
                history: []
            };
        }
    }
}
