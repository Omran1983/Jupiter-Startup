import { processRun } from "./src/workflows/process_run";

async function main() {
    console.log("--- TESTING CUSTOMS TRACKER WORKFLOW ---");

    // Test Case 1: Customs Hold
    const input1 = {
        carrier: "USPS",
        trackingNumber: "LM123456789STUCK",
        destinationCountry: "US",
    };

    const report1 = await processRun({ runId: "test-run-001", input: input1 });
    console.log("\nRESULT 1 (Stuck):");
    console.log(JSON.stringify(report1.analysis, null, 2));

    // Test Case 2: Delivered
    const input2 = {
        carrier: "UPS",
        trackingNumber: "1Z9999999999999001",
        destinationCountry: "US",
    };
    const report2 = await processRun({ runId: "test-run-002", input: input2 });
    console.log("\nRESULT 2 (Delivered):");
    console.log(JSON.stringify(report2.analysis, null, 2));
}

main().catch(console.error);
