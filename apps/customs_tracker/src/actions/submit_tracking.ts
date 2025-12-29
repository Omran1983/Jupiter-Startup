"use server";

import { redirect } from "next/navigation";
import { CustomsRunInputSchema } from "../types/validation";
import { processRun } from "../workflows/process_run";

export async function submitTracking(formData: FormData) {
    const carrier = formData.get("carrier") as string;
    const trackingNumber = formData.get("trackingNumber") as string;
    const destinationCountry = formData.get("destinationCountry") as string || "US";

    // Validate
    const validation = CustomsRunInputSchema.safeParse({
        carrier,
        trackingNumber,
        destinationCountry,
    });

    if (!validation.success) {
        throw new Error("Invalid Input");
    }

    // Generate Run ID (Mock DB ID)
    const runId = "run-" + Date.now();

    // Execute Logic (In a real app, this would be async/queued, but for MVP we await)
    await processRun({
        runId,
        input: validation.data,
    });

    // Redirect to Report
    redirect(`/report/${runId}?carrier=${carrier}&tracking=${trackingNumber}&country=${destinationCountry}`);
}
