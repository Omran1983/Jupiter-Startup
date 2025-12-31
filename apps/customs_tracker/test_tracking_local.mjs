// Direct test of PublicTrackingService
async function testTracking() {
    // Import the service
    const { PublicTrackingService } = await import('./src/services/tracking_public.ts');

    const service = new PublicTrackingService();

    console.log('=== TESTING PUBLIC TRACKING SERVICE ===\n');
    console.log('Tracking Number: 710212543935');
    console.log('Carrier: yanwen\n');

    try {
        const result = await service.getStatus('yanwen', '710212543935');

        console.log('✅ SUCCESS!\n');
        console.log('Status:', result.status);
        console.log('Raw Status:', result.rawStatus);
        console.log('Location:', result.location);
        console.log('Last Updated:', result.lastUpdated);
        console.log('Estimated Delivery:', result.estimatedDelivery);
        console.log('\n📦 TRACKING HISTORY:');
        console.log('Total Events:', result.history.length);

        if (result.history.length > 0) {
            console.log('\nFirst 3 Events:');
            result.history.slice(0, 3).forEach((event, i) => {
                console.log(`\n${i + 1}. ${event.date}`);
                console.log(`   Status: ${event.status}`);
                console.log(`   Details: ${event.details}`);
                console.log(`   Location: ${event.location}`);
            });
        } else {
            console.log('⚠️ NO EVENTS FOUND - API may have failed, using fallback');
        }

    } catch (err) {
        console.error('❌ FAILED:', err.message);
        console.error(err.stack);
    }
}

testTracking();
