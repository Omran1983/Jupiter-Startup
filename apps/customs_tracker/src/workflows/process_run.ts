import { createClient } from "@supabase/supabase-js";
import { MockTrackingService } from "../services/tracking";
import { CustomsAnalyzer } from "../services/analyzer";
import { CustomsRunInput } from "../types/validation";

// Setup Supabase Client (Service Role for Writes)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Must use Service Role to write if RLS is strict

const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : null;

interface RunContext {
    runId: string;
    input: CustomsRunInput;
    orgId?: string; // Optional: If authenticated
}

export async function processRun(context: RunContext) {
    console.log(`[Orchestrator] Starting Run ${context.runId}...`);

    // 1. Init Services
    const tracker = new MockTrackingService();
    const analyzer = new CustomsAnalyzer();

    // 2. Execute Tracking
    const { carrier, trackingNumber, destinationCountry } = context.input;
    const trackResult = await tracker.getStatus(carrier, trackingNumber);

    // 3. Analyze
    const analysis = analyzer.analyze(trackResult, destinationCountry || "US");

    // 4. Generate Output Artifact
    const output = {
        tracking: trackResult,
        analysis: analysis,
        generatedAt: new Date().toISOString(),
    };

    // 5. Persist to DB (If Supabase is configued)
    if (supabase) {
        // We use the ID passed in, or generate one if strictly DB generated
        const { error } = await supabase
            .from("runs")
            .insert({
                id: context.runId,
                org_id: context.orgId || "00000000-0000-0000-0000-000000000000", // Fallback for anon run
                workflow_id: "customs-tracker-v1",
                status: "succeeded",
                input_payload: context.input,
                output_summary: output,
            });

        if (error) {
            console.error("Failed to save run:", error);
        } else {
            console.log("Run saved to Supabase.");
        }
    } else {
        console.warn("Supabase not configured. Skipping persistence.");
    }

    return output;
}
