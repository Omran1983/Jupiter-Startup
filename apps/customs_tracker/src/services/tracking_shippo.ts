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

    // Intelligent Heuristic to save API credits
    // Returns a prioritized list of carriers to try
    private detectCarrierPattern(tracking: string): string[] {
        // Yanwen: Often starts with VR, UR, LP, or starts with 7 (like 710...) and 12-14 digits
        if (/^(VR|UR|LP|SY)/i.test(tracking) || /^7[0-9]{11,13}$/.test(tracking) || /^H[A-Z0-9]+/.test(tracking)) {
            return ['yanwen', 'china-post', '4px'];
        }
        // USPS: 20-22 digits, or starts with 92/93, or standard XX...US
        if (/^[0-9]{20,22}$/.test(tracking) || /^[A-Z]{2}[0-9]{9}US$/.test(tracking)) {
            return ['usps'];
        }
        // China Post: XX...CN (e.g. LV...CN)
        if (/^[A-Z]{2}[0-9]{9}CN$/.test(tracking)) {
            // China Post numbers are often dual-scannable via EMS or Cainiao
            return ['china-post', 'ems', 'cainiao'];
        }
        // 4PX: often numeric or 4PX prefix, but variable
        if (/^4PX/i.test(tracking)) {
            return ['4px'];
        }

        // Default Fallback Order (Most popular dropshipping first)
        return ['yanwen', 'china-post', 'usps', '4px', 'cainiao'];
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
                // Log failed attempts for debugging (optional)
                // console.log(`[Shippo] Failed ${c}/${t}: ${res.status}`);
                return null;
            }
            return await res.json();
        };

        try {
            console.log(`[Shippo] Tracking ${carrier} ${trackingNumber}`);

            // OPTIMIZATION: Check pattern first
            const recommendedCarriers = this.detectCarrierPattern(trackingNumber);
            let track = null;
            let finalCarrier = carrier;

            // 1. Try Recommended First logic
            // If the user's selected carrier is in the recommended list, try that specific one first
            // Otherwise, start from the top of the recommended list

            const userSelectionMatchesRecommendation = recommendedCarriers.includes(carrier.toLowerCase());

            if (userSelectionMatchesRecommendation) {
                // Trust user + heuristics
                track = await fetchShippo(carrier, trackingNumber);
            } else {
                // User might be wrong (e.g. tracking Yanwen number as USPS)
                // Or we might be wrong.
                // Strategy: Try the top Recommended Carrier first (likely correct), then fallback to User's choice.
                console.log(`[Shippo] Auto-Detect suggests ${recommendedCarriers[0]} instead of ${carrier}`);
                track = await fetchShippo(recommendedCarriers[0], trackingNumber);
                if (track && track.tracking_history && track.tracking_history.length > 0) {
                    finalCarrier = recommendedCarriers[0];
                } else {
                    // Fallback to what user asked for
                    track = await fetchShippo(carrier, trackingNumber);
                }
            }

            // 3. Deep Scan / Fallback (Smart Mode) if still empty
            if (!track || !track.tracking_history || track.tracking_history.length === 0) {
                console.log("[Shippo] Scan Empty. Trying Smart Fallbacks...");

                for (const fallback of recommendedCarriers) {
                    if (fallback === finalCarrier.toLowerCase()) continue;
                    try {
                        const deepTrack = await fetchShippo(fallback, trackingNumber);
                        if (deepTrack && deepTrack.tracking_history && deepTrack.tracking_history.length > 0) {
                            console.log(`[Shippo] Match via ${fallback}!`);
                            track = deepTrack;
                            finalCarrier = fallback;
                            break;
                        }
                    } catch (ignore) { }
                }
            }

            // 4. HYBRID FALLBACK: If Shippo has no history, try Public Service
            if (!track || !track.tracking_history || track.tracking_history.length === 0) {
                console.log(`[Shippo] No history found. Falling back to Public Service for ${carrier}...`);
                try {
                    // Lazy load to avoid circular dependency issues if any
                    const { SmartFallbackService } = await import("./tracking_public");
                    const publicTracker = new SmartFallbackService();
                    const publicResult = await publicTracker.getStatus(carrier, trackingNumber);

                    if (publicResult && publicResult.history && publicResult.history.length > 0) {
                        console.log(`[Shippo] Public Service Fallback Successful!`);
                        return {
                            ...publicResult,
                            // Ensure we keep the original carrier request if needed, or trust public result
                            carrier: publicResult.carrier || carrier
                        };
                    }
                } catch (fallbackError) {
                    console.error("[Shippo] Public Fallback Failed:", fallbackError);
                }
            }

            if (!track || !track.tracking_history || track.tracking_history.length === 0) {
                return {
                    carrier,
                    trackingNumber,
                    status: "pre_transit", // Default to pre_transit if absolutely no data found
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
                status: h.status || "Unknown", // Shippo status
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
                carrier: finalCarrier,
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
