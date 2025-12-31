// Quick test of the public tracking service
const { PublicTrackingService } = require('../src/services/tracking_public.ts');

async function test() {
    const service = new PublicTrackingService();

    console.log('Testing with tracking number: 710212543935');
    console.log('Carrier: yanwen\n');

    try {
        const result = await service.getStatus('yanwen', '710212543935');

        console.log('✅ SUCCESS!');
        console.log('\nTracking Result:');
        console.log('- Status:', result.status);
        console.log('- Raw Status:', result.rawStatus);
        console.log('- Location:', result.location);
        console.log('- Last Updated:', result.lastUpdated);
        console.log('- History Events:', result.history.length);

        if (result.history.length > 0) {
            console.log('\nFirst Event:');
            console.log(JSON.stringify(result.history[0], null, 2));
        }

    } catch (err) {
        console.error('❌ FAILED:', err.message);
    }
}

test();
