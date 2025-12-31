import { ITrackingService, TrackingResult } from "./tracking";

/**
 * Smart Fallback Tracking Service
 * Generates realistic tracking data based on carrier patterns
 * Perfect for MVP/demo until real API credentials are available
 * 
 * NOTE: This generates SIMULATED data for demonstration purposes
 * Switch to real API (Shippo/AfterShip) for production use
 */
export class SmartFallbackService implements ITrackingService {

    async getStatus(carrier: string, trackingNumber: string): Promise<TrackingResult> {
        console.log(`[SmartFallback] Generating realistic data for ${carrier} ${trackingNumber}`);

        // Generate realistic tracking history
        const history = this.generateRealisticHistory(carrier, trackingNumber);
        const latest = history[0] || {};

        // Calculate estimated delivery (3-7 days from now based on carrier)
        const daysToDeliver = this.estimateDeliveryDays(carrier);
        const estimatedDelivery = new Date(Date.now() + daysToDeliver * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0];

        return {
            carrier,
            trackingNumber,
            status: this.mapStatus(latest.status || "transit"),
            rawStatus: latest.details || "Package in transit",
            location: latest.location || "Regional Hub",
            estimatedDelivery,
            lastUpdated: latest.date || new Date().toISOString(),
            history
        };
    }

    private generateRealisticHistory(carrier: string, trackingNumber: string): any[] {
        const now = new Date();
        const isChina = ['yanwen', 'china-post', '4px', 'cainiao', 'yunexpress'].includes(carrier.toLowerCase());

        // Yanwen 710... specific handling
        const isYanwenSpecial = trackingNumber.startsWith("710") && carrier.toLowerCase().includes("yanwen");

        // Determine package age based on tracking number (use last digits as seed)
        // Ensure parsing works for numeric strings
        let seed = 0;
        try {
            seed = parseInt(trackingNumber.slice(-4), 10) % 15;
            if (isNaN(seed)) seed = 5;
        } catch (e) {
            seed = 5;
        }

        const daysOld = isYanwenSpecial ? 4 : (7 + seed); // Yanwen 710 usually newer (3-5 days)

        const events = [];

        // Event 1: Label created / Info received
        events.push({
            date: new Date(now.getTime() - daysOld * 24 * 60 * 60 * 1000).toISOString(),
            status: "INFO_RECEIVED",
            details: "Shipment information received",
            location: isChina ? "Shenzhen, China" : "Origin Facility, US"
        });

        // Event 2: Picked up
        if (daysOld >= 1) {
            events.push({
                date: new Date(now.getTime() - (daysOld - 1) * 24 * 60 * 60 * 1000).toISOString(),
                status: "IN_TRANSIT",
                details: "Package picked up by carrier",
                location: isChina ? "Shenzhen Sorting Center" : "Local Post Office"
            });
        }

        // Yanwen Specific Flow
        if (isYanwenSpecial) {
            if (daysOld >= 2) {
                events.push({
                    date: new Date(now.getTime() - (daysOld - 2) * 24 * 60 * 60 * 1000).toISOString(),
                    status: "IN_TRANSIT",
                    details: "Booking Arranged (已揽收)",
                    location: "Yanwen Facility, China"
                });
            }
            if (daysOld >= 3) {
                events.push({
                    date: new Date(now.getTime() - (daysOld - 2.5) * 24 * 60 * 60 * 1000).toISOString(),
                    status: "IN_TRANSIT",
                    details: "Documentation Prepared (转运中已发货)",
                    location: "Yanwen Facility, China"
                });
            }
        } else if (isChina) {
            // Event 3: Departed origin country
            events.push({
                date: new Date(now.getTime() - (daysOld - 3) * 24 * 60 * 60 * 1000).toISOString(),
                status: "IN_TRANSIT",
                details: "Departed from country of origin",
                location: "Shanghai International Hub"
            });

            // Event 4: In transit (flight)
            events.push({
                date: new Date(now.getTime() - (daysOld - 5) * 24 * 60 * 60 * 1000).toISOString(),
                status: "IN_TRANSIT",
                details: "In transit to destination country",
                location: "International Transit"
            });

            // Event 5: Arrived at destination
            events.push({
                date: new Date(now.getTime() - (daysOld - 7) * 24 * 60 * 60 * 1000).toISOString(),
                status: "IN_TRANSIT",
                details: "Arrived at destination country",
                location: "Los Angeles ISC"
            });

            // Event 6: Customs processing
            events.push({
                date: new Date(now.getTime() - (daysOld - 9) * 24 * 60 * 60 * 1000).toISOString(),
                status: "IN_TRANSIT",
                details: "Customs clearance processing",
                location: "Los Angeles ISC"
            });

            // Event 7: Cleared customs
            events.push({
                date: new Date(now.getTime() - (daysOld - 10) * 24 * 60 * 60 * 1000).toISOString(),
                status: "IN_TRANSIT",
                details: "Cleared customs",
                location: "Los Angeles ISC"
            });
        }

        // Event: Arrived at regional facility
        events.push({
            date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: "IN_TRANSIT",
            details: "Arrived at regional facility",
            location: "Regional Distribution Center"
        });

        // Event: Out for delivery or in transit
        events.push({
            date: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
            status: "IN_TRANSIT",
            details: "In transit to local facility",
            location: "Local Hub"
        });

        return events.reverse(); // Most recent first
    }

    private estimateDeliveryDays(carrier: string): number {
        const estimates: Record<string, number> = {
            'yanwen': 5,
            'china-post': 6,
            '4px': 4,
            'cainiao': 5,
            'yunexpress': 4,
            'usps': 3,
            'ups': 2,
            'fedex': 2,
            'dhl': 2
        };
        return estimates[carrier.toLowerCase()] || 4;
    }

    private mapStatus(status: string): TrackingResult['status'] {
        const s = status.toLowerCase();
        if (s.includes("delivered")) return "delivered";
        if (s.includes("exception") || s.includes("returned")) return "exception";
        if (s.includes("customs") || s.includes("held")) return "customs_hold";
        if (s.includes("info") || s.includes("pending")) return "pre_transit";
        return "transit";
    }
}
