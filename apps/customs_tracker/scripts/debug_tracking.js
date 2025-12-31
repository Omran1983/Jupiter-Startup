const shippoPkg = require('shippo');
const fs = require('fs');
const path = require('path');

// 1. LOAD ENV FIRST
const envPath = path.resolve(__dirname, '../.env.local');
let SHIPPO_TOKEN = "";

if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/SHIPPO_API_KEY=(.+)/);
    if (match && match[1]) {
        SHIPPO_TOKEN = match[1].trim();
    }
}

if (!SHIPPO_TOKEN) {
    console.error("Missing SHIPPO_API_KEY in .env.local");
    process.exit(1);
}

// 2. INIT CLIENT
console.log("DEBUG: Shippo Package Type:", typeof shippoPkg);
console.log("DEBUG: Shippo Keys:", Object.keys(shippoPkg));

let client;
try {
    // New SDK style - Try just the token
    if (shippoPkg.Shippo) {
        console.log("DEBUG: Using v2 SDK Init with RAW TOKEN");
        client = new shippoPkg.Shippo({ apiKeyHeader: SHIPPO_TOKEN });
    } else {
        // Old style fallback
        client = (typeof shippoPkg === 'function') ? shippoPkg("ShippoToken " + SHIPPO_TOKEN) : shippoPkg;
    }
} catch (e) {
    console.error("Init Error:", e);
}

// 3. RUN SCAN
async function scan(carrier, tracking) {
    if (!client) {
        console.error("Client not initialized");
        return;
    }

    console.log(`\n--- Scanning ${carrier.toUpperCase()} [${tracking}] ---`);
    try {
        // Attempt to find the right method dynamically if .track is missing
        let trackMethod = client.track?.get_status;

        // If v2 SDK, it might be client.trackingStatus.get(...)
        if (!trackMethod && client.trackingStatus) {
            console.log("DEBUG: Detected v2 SDK (trackingStatus)");
            const result = await client.trackingStatus.get(carrier, tracking);

            // Inspect result structure
            console.log("Keys:", Object.keys(result));
            // Try to access status
            const statusObj = result.trackingStatus || result;
            console.log("Status:", statusObj.status || "NULL");
            return;
        }

        const track = await client.track.get_status(carrier, tracking);
        console.log("Status:", track.tracking_status ? track.tracking_status.status : "NULL");
        console.log("History Length:", track.tracking_history.length);
        if (track.tracking_history.length > 0) {
            console.log("First Event:", track.tracking_history[0]);
            console.log("Last Event:", track.tracking_history[track.tracking_history.length - 1]);
        } else {
            console.log("RAW DUMP:", JSON.stringify(track, null, 2));
        }
    } catch (e) {
        console.log("Error:", e.message);
    }
}

async function run() {
    const TRACKING_NUMBER = "710212543935"; // The user's problematic number

    await scan('usps', TRACKING_NUMBER);
    await scan('yanwen', TRACKING_NUMBER);
    await scan('china-post', TRACKING_NUMBER);
    await scan('4px', TRACKING_NUMBER);
    await scan('cainiao', TRACKING_NUMBER);
}

run();
