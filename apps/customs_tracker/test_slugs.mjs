
// Test script to verify Shippo API case sensitivity for carrier slugs
const key = process.env.SHIPPO_API_KEY;
const tracking = '710212543935';
const variations = ['Yanwen', 'yanwen', 'YANWEN'];

if (!key) {
    console.error("No API Key found");
    process.exit(1);
}

async function test() {
    console.log("--- Starting Slug Case Sensitivity Test ---");
    for (const carrier of variations) {
        process.stdout.write(`Testing slug "${carrier}"... `);
        try {
            const res = await fetch(`https://api.goshippo.com/tracks/${carrier}/${tracking}`, {
                headers: {
                    'Authorization': `ShippoToken ${key.trim()}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log(`HTTP ${res.status}`);
            if (res.ok) {
                const data = await res.json();
                console.log(`   > Success! History Length: ${data.tracking_history?.length}`);
            } else {
                console.log(`   > Failed.`);
            }
        } catch (e) {
            console.log(`   > Error: ${e.message}`);
        }
    }
}

test();
