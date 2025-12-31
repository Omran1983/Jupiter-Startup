import { ITrackingService, TrackingResult } from "./tracking";

export class ShippoTrackingService implements ITrackingService {

    private mapStatus(shippoStatus: string): TrackingResult['status'] {
        const s = shippoStatus?.toUpperCase() || "";
        if (s === "DELIVERED") return "delivered";
        if (s === "FAILURE" || s === "RETURNED" || s === "ERROR") return "exception";
        if (s === "TRANSIT") return "transit";
        if (s === "PRE_TRANSIT" || s === "UNKNOWN") return "pre_transit";
        if (s.includes("CUSTOMS") || s.includes("HELD")) return "customs_hold";
        return "transit";
    }

    async getStatus(carrier: string, trackingNumber: string): Promise<TrackingResult> {
        const SHIPPO_TOKEN = process.env.SHIPPO_API_KEY!;
        if (!SHIPPO_TOKEN) throw new Error("Missing credentials");

        // Use direct Fetch to avoid SDK headaches
        const fetchShippo = async (c: string, t: string) => {
            const url = `https://api.goshippo.com/tracks/${c}/${t}`;
            const res = await fetch(url, {
                headers: {
                    "Authorization": `ShippoToken ${SHIPPO_TOKEN.trim()}`,
                    "Content-Type": "application/json"
                },
                // Crucial: Bypass Next.js Cache for real-time tracking
                cache: "no-store",
            });
            if (!res.ok) {
                // Log failed attempts for debugging
                // console.log(`[Shippo] Failed ${c}/${t}: ${res.status}`);
                return null;
            }
            return await res.json();
        };

        try {
            console.log(`[Shippo] Tracking ${carrier} ${trackingNumber}`);

            // 1. Primary Attempt
            let track = await fetchShippo(carrier, trackingNumber);

            // 2. Deep Scan Logic (Auto-Detect)
            // If primary carrier has NO history (e.g. USPS waiting for Yanwen), try fallbacks
            if (!track || !track.tracking_history || track.tracking_history.length === 0) {
                console.log("[Shippo] Primary carrier empty. Initiating Deep Scan...");
                const FALLBACKS = ['yanwen', 'china-post', '4px', 'cainiao'];

                for (const fallback of FALLBACKS) {
                    if (fallback === carrier) continue;
                    try {
                        const deepTrack = await fetchShippo(fallback, trackingNumber);
                        if (deepTrack && deepTrack.tracking_history && deepTrack.tracking_history.length > 0) {
                            console.log(`[Shippo] Details found via ${fallback}!`);
                            track = deepTrack;
                            carrier = fallback;
                            break;
                        }
                    } catch (ignore) { }
                }
            }

            if (!track || !track.tracking_history || track.tracking_history.length === 0) {
                return {
                    carrier,
                    trackingNumber,
                    status: "pre_transit",
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
                location: h.location?.city || h.location?.country || ""
            }));

            // Get latest status
            const latest = history[0];
            const latestShippoStatus = track.tracking_status?.status || latest?.status || "UNKNOWN";

            const rawStatusText = (track.tracking_status?.status_details || latest?.details || "").toLowerCase();
            let finalStatus = this.mapStatus(latestShippoStatus);

            if (rawStatusText.includes("customs") || rawStatusText.includes("held")) {
                finalStatus = "customs_hold";
            }

            return {
                carrier,
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
