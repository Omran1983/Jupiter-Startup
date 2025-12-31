import { createClient } from "@supabase/supabase-js";
import { ShippoTrackingService } from "../services/tracking_shippo";
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

    // 1. Init Services - Using PUBLIC API (no signup/key needed, REAL data)
    const { PublicTrackingService } = await import("../services/tracking_public");
    const tracker = new PublicTrackingService();
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

    // 4.5 Send Telegram Alert (If configured and critical)
    try {
        if (analysis.riskAssessment.level === "CRITICAL" || analysis.riskAssessment.level === "HIGH" || trackResult.status === "customs_hold") {
            const { TelegramService } = await import("../services/telegram");
            const telegram = new TelegramService();

            // Note: In a real app, we need the User's ChatID. 
            // For now, we Alert the ADMIN (Omran) or use a provided ChatID in input.
            const targetChatId = context.input.telegramChatId || process.env.ADMIN_TELEGRAM_CHAT_ID;

            if (targetChatId) {
                const icon = analysis.riskAssessment.level === "CRITICAL" ? "🚨" : "⚠️";
                const msg = `${icon} *Customs Alert*\n\nPackage: \`${trackingNumber}\`\nStatus: *${analysis.consumerStatus}*\nRisk: ${analysis.riskAssessment.level} (${analysis.riskAssessment.score}/100)\n\n_Check Dashboard for details._`;
                await telegram.sendAlert(targetChatId, msg);
            }
        }
    } catch (err) {
        console.error("Failed to send telegram alert:", err);
    }

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
