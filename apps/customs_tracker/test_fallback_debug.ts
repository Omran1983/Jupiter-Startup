
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { SmartFallbackService } from './src/services/tracking_public';
import { ShippoTrackingService } from './src/services/tracking_shippo';

async function test() {
    console.log("--- TEST START ---");

    // 1. Test Public Fallback directly
    console.log("\n1. Testing SmartFallbackService directly...");
    try {
        const publicService = new SmartFallbackService();
        const result = await publicService.getStatus('yanwen', '710212543935');
        console.log("Public Result History Length:", result.history.length);
        console.log("First Event:", result.history[0]);
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
        if (result.history.length > 0) {
            console.log("First Event:", result.history[0]);
        } else {
            console.log("WARNING: History is empty!");
        }
    } catch (e: any) {
        console.error("Shippo Service FAILED:", e);
    }

    console.log("--- TEST END ---");
}

test();
