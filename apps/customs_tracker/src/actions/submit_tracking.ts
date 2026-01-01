"use server";

import { redirect } from "next/navigation";
import { CustomsRunInputSchema } from "../types/validation";
import { processRun } from "../workflows/process_run";
import { createClient } from "../utils/supabase/server";

export async function submitTracking(formData: FormData) {
    const rawInput = formData.get("trackingNumber") as string;
    const carrier = formData.get("carrier") as string;
    const destinationCountry = formData.get("destinationCountry") as string || "US";

    // Split and Clean Input (Support for Comma or Newline)
    const trackingNumbers = rawInput
        .split(/[\n,]/) // Split by newline or comma
        .map(t => t.trim())
        .filter(t => t.length > 5); // Basic filter to avoid empty/short junk

    if (trackingNumbers.length === 0) {
        throw new Error("Please enter at least one valid tracking number.");
    }

    // PATH 1: Single Tracking (Standard Flow)
    if (trackingNumbers.length === 1) {
        const validation = CustomsRunInputSchema.safeParse({
            carrier,
            trackingNumber: trackingNumbers[0],
            destinationCountry,
        });

        if (!validation.success) {
            throw new Error("Invalid Input: " + validation.error.message);
        }

        // Generate ID for consistency (processRun normally expects it or generates it, but context requires it)
        const runId = crypto.randomUUID();
        await processRun({
            runId,
            input: validation.data
        });

        // ROBUST FIX: Pass params in URL ("Stateless Mode") so page renders even if DB Insert failed.
        const params = new URLSearchParams({
            carrier: carrier,
            tracking: trackingNumbers[0],
            country: destinationCountry
        });

        redirect(`/report/${runId}?${params.toString()}`);
    }

    // PATH 2: Bulk Tracking (Batch Flow)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let orgId = undefined;
    if (user) {
        const { data: member } = await supabase.from('org_members').select('org_id').eq('user_id', user.id).single();
        orgId = member?.org_id || undefined;
    }

    const batchName = `Batch ${new Date().toLocaleDateString()} (${trackingNumbers.length} Items)`;

    // Create Batch Record
    const { data: batch, error: batchError } = await supabase.from('batches').insert({
        org_id: orgId, // Can be null if anon
        name: batchName,
        total_items: trackingNumbers.length,
        status: 'processing'
    }).select('id').single();

    if (batchError) {
        console.error("Batch Create Error:", batchError);
        throw new Error("Failed to initialize batch processing.");
    }

    // Process Loop (Sequential for stability in Server Action / MVP)
    for (const num of trackingNumbers) {
        try {
            const runId = crypto.randomUUID();
            await processRun({
                runId,
                input: {
                    trackingNumber: num,
                    carrier,
                    destinationCountry,
                },
                orgId
            });

            // Optionally link run to batch here if we added batch_id to runs?
            // Yes, we added the column in SQL. But processRun doesn't support 'batchId' in input yet.
            // We can manually patch it:
            if (batch?.id) {
                await supabase.from('runs').update({ batch_id: batch.id }).eq('id', runId);
            }

        } catch (e) {
            console.error(`Failed to process ${num}`, e);
        }
    }

    // Redirect to Dashboard (Assuming dashboard can show recent batches or runs)
    redirect(`/dashboard?batch_success=${batch.id}`);
}
