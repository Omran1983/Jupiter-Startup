import { ITrackingService, TrackingResult } from "./tracking";

/**
 * AfterShip Tracking Service - REAL tracking data
 * Free tier: 50 requests/month, 1000+ carriers
 * https://www.aftership.com/docs/tracking/quickstart
 */
export class AfterShipTrackingService implements ITrackingService {

    private mapStatus(aftershipStatus: string): TrackingResult['status'] {
        const s = aftershipStatus.toLowerCase();

        // AfterShip status mapping
        // https://www.aftership.com/docs/tracking/reference/status-code
        if (s === "delivered") return "delivered";
        if (s === "exception" || s === "expired" || s === "failed_attempt") return "exception";
        if (s === "in_transit" || s === "out_for_delivery") return "transit";
        if (s === "info_received" || s === "pending") return "pre_transit";

        // Customs detection
        if (s.includes("customs") || s.includes("held")) return "customs_hold";

        return "transit";
    }

    async getStatus(carrier: string, trackingNumber: string): Promise<TrackingResult> {
        const AFTERSHIP_API_KEY = process.env.AFTERSHIP_API_KEY;

        if (!AFTERSHIP_API_KEY) {
            throw new Error("AfterShip API key not configured");
        }

        console.log(`[AfterShip] Tracking ${carrier} ${trackingNumber}`);

        try {
            // Step 1: Create tracking (or get existing)
            const createRes = await fetch('https://api.aftership.com/v4/trackings', {
                method: 'POST',
                headers: {
                    'aftership-api-key': AFTERSHIP_API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tracking: {
                        tracking_number: trackingNumber,
                        slug: this.mapCarrierToSlug(carrier)
                    }
                })
            });

            if (!createRes.ok && createRes.status !== 409) { // 409 = already exists
                const error = await createRes.json();
                throw new Error(`AfterShip create failed: ${JSON.stringify(error)}`);
            }

            // Step 2: Get tracking details
            const slug = this.mapCarrierToSlug(carrier);
            const getRes = await fetch(
                `https://api.aftership.com/v4/trackings/${slug}/${trackingNumber}`,
                {
                    headers: {
                        'aftership-api-key': AFTERSHIP_API_KEY,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!getRes.ok) {
                const error = await getRes.json();
                throw new Error(`AfterShip get failed: ${JSON.stringify(error)}`);
            }

            const data = await getRes.json();
            const tracking = data.data.tracking;

            // Map checkpoints to history
            const history = (tracking.checkpoints || []).map((cp: any) => ({
                date: cp.checkpoint_time || new Date().toISOString(),
                status: cp.tag || "Unknown",
                details: cp.message || cp.subtag_message || "",
                location: cp.location || cp.city || ""
            }));

            // Get latest checkpoint
            const latest = history[0] || {};

            return {
                carrier: tracking.slug || carrier,
                trackingNumber,
                status: this.mapStatus(tracking.tag || "pending"),
                rawStatus: tracking.subtag_message || tracking.tag || "Processing",
                location: latest.location || "Unknown",
                estimatedDelivery: tracking.expected_delivery || undefined,
                lastUpdated: tracking.updated_at || new Date().toISOString(),
                history
            };

        } catch (error: any) {
            console.error("AfterShip Error:", error);
            return {
                carrier,
                trackingNumber,
                status: "exception",
                rawStatus: "Error: " + (error.message || "Could not fetch tracking data"),
                location: "Unknown",
                lastUpdated: new Date().toISOString(),
                history: []
            };
        }
    }

    /**
     * Map our carrier names to AfterShip slugs
     * Full list: https://www.aftership.com/courier
     */
    private mapCarrierToSlug(carrier: string): string {
        const mapping: Record<string, string> = {
            'usps': 'usps',
            'ups': 'ups',
            'fedex': 'fedex',
            'dhl': 'dhl',
            'yanwen': 'yanwen',
            'china-post': 'china-post',
            'china post': 'china-post',
            '4px': '4px',
            'cainiao': 'cainiao',
            'yunexpress': 'yunexpress',
            'royal mail': 'royal-mail',
            'canada post': 'canada-post',
            'australia post': 'australia-post'
        };

        return mapping[carrier.toLowerCase()] || carrier.toLowerCase();
    }
}
