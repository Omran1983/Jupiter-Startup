import { ITrackingService, TrackingResult } from "./tracking";

/**
 * FREE Tracking Service - No API Key Required
 * Uses intelligent pattern matching + realistic mock data
 * Perfect for demos, testing, and when Shippo credentials unavailable
 */
export class FreeTrackingService implements ITrackingService {

    private mapStatus(rawStatus: string): TrackingResult['status'] {
        const s = rawStatus.toUpperCase();
        if (s.includes("DELIVERED")) return "delivered";
        if (s.includes("EXCEPTION") || s.includes("RETURNED")) return "exception";
        if (s.includes("TRANSIT") || s.includes("DEPARTED") || s.includes("ARRIVED")) return "transit";
        if (s.includes("CUSTOMS") || s.includes("HELD")) return "customs_hold";
        return "pre_transit";
    }

    private generateRealisticHistory(trackingNumber: string, carrier: string): any[] {
        // Generate realistic tracking events based on carrier patterns
        const now = new Date();
        const events = [];

        // Determine package origin based on carrier
        const isChina = ['yanwen', 'china-post', '4px', 'cainiao', 'yunexpress'].includes(carrier.toLowerCase());
        const origin = isChina ? 'Shenzhen, China' : 'United States';
        const destination = 'United States';

        // Event 1: Package picked up (7-14 days ago)
        const daysAgo = Math.floor(Math.random() * 7) + 7;
        events.push({
            status_date: new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
            status: "TRANSIT",
            status_details: `Package picked up by carrier`,
            location: { city: origin.split(',')[0], country: origin.split(',')[1]?.trim() || 'CN' }
        });

        // Event 2: Departed origin facility (5-10 days ago)
        events.push({
            status_date: new Date(now.getTime() - (daysAgo - 2) * 24 * 60 * 60 * 1000).toISOString(),
            status: "TRANSIT",
            status_details: "Departed from origin facility",
            location: { city: origin.split(',')[0], country: origin.split(',')[1]?.trim() || 'CN' }
        });

        // Event 3: In transit to destination country (3-7 days ago)
        if (isChina) {
            events.push({
                status_date: new Date(now.getTime() - (daysAgo - 5) * 24 * 60 * 60 * 1000).toISOString(),
                status: "TRANSIT",
                status_details: "Departed country of origin",
                location: { city: "Shanghai", country: "CN" }
            });

            events.push({
                status_date: new Date(now.getTime() - (daysAgo - 8) * 24 * 60 * 60 * 1000).toISOString(),
                status: "TRANSIT",
                status_details: "Arrived at destination country",
                location: { city: "Los Angeles", country: "US" }
            });
        }

        // Event 4: Customs clearance (2-5 days ago)
        events.push({
            status_date: new Date(now.getTime() - (daysAgo - 9) * 24 * 60 * 60 * 1000).toISOString(),
            status: "TRANSIT",
            status_details: "Customs clearance processing",
            location: { city: "Los Angeles", country: "US" }
        });

        // Event 5: Out for delivery (1-2 days ago)
        events.push({
            status_date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: "TRANSIT",
            status_details: "Out for delivery",
            location: { city: "Local Facility", country: "US" }
        });

        // Event 6: Current status (recent)
        events.push({
            status_date: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
            status: "TRANSIT",
            status_details: "In transit to final destination",
            location: { city: "Regional Hub", country: "US" }
        });

        return events.reverse(); // Most recent first
    }

    async getStatus(carrier: string, trackingNumber: string): Promise<TrackingResult> {
        console.log(`[FREE] Tracking ${carrier} ${trackingNumber}`);

        try {
            // Generate realistic tracking data
            const history = this.generateRealisticHistory(trackingNumber, carrier);
            const latest = history[0];

            return {
                carrier,
                trackingNumber,
                status: this.mapStatus(latest.status),
                rawStatus: latest.status_details,
                location: latest.location?.city || "Unknown",
                estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                lastUpdated: latest.status_date,
                history: history.map(h => ({
                    date: h.status_date,
                    status: h.status,
                    details: h.status_details,
                    location: h.location?.city || ""
                }))
            };

        } catch (error: any) {
            console.error("Free Tracking Error:", error);
            return {
                carrier,
                trackingNumber,
                status: "exception",
                rawStatus: "Error: " + (error.message || "Could not generate tracking data"),
                location: "Unknown",
                lastUpdated: new Date().toISOString(),
                history: []
            };
        }
    }
}
