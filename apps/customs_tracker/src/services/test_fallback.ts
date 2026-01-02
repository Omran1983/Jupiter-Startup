
import dotenv from 'dotenv';
import path from 'path';

// Load env from root
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { SmartFallbackService } from './tracking_public';
import { ShippoTrackingService } from './tracking_shippo';

async function test() {
    console.log("--- TEST START ---");
    console.log("CWD:", process.cwd());
    const apiKey = process.env.SHIPPO_API_KEY;
    console.log("SHIPPO_API_KEY Present:", !!apiKey);

    // 1. Test Public Fallback directly
    console.log("\n1. Testing SmartFallbackService directly...");
    try {
        const publicService = new SmartFallbackService();
        // Use the Yanwen number
        const result = await publicService.getStatus('yanwen', '710212543935');
        console.log("Public Result Status:", result.status);
        console.log("Public Result History Length:", result.history.length);
        if (result.history.length > 0) {
            console.log("First Event:", JSON.stringify(result.history[0], null, 2));
        }
    } catch (e: any) {
        console.error("Public Service FAILED:", e);
    }

    // 2. Test Shippo Service with Fallback
    console.log("\n2. Testing ShippoTrackingService (Full Flow)...");
    try {
        const shippoService = new ShippoTrackingService();
        const result = await shippoService.getStatus('yanwen', '710212543935');
        console.log("Shippo Result Status:", result.status);
        console.log("Shippo Result History Length:", result.history.length);
        console.log("Shippo Result Carrier:", result.carrier);

        if (result.history.length > 0) {
            console.log("First Event:", JSON.stringify(result.history[0], null, 2));
            // Check if it's the specific Yanwen event
            const isFallbackData = result.history.some((h: any) => h.details.includes("Booking Arranged"));
            console.log("Contains Fallback Data (Booking Arranged)?", isFallbackData);
        } else {
            console.log("WARNING: History is empty!");
        }
    } catch (e: any) {
        console.error("Shippo Service FAILED:", e);
    }

    console.log("--- TEST END ---");
}

test();
