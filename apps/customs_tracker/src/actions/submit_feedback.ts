"use server";
// Force Rebuild: 2026-01-02 Fix Action Mismatch

import { createClient } from "@supabase/supabase-js";

export async function submitFeedbackAction(comment: string, email: string) {
    console.log("Submit Feedback Action Triggered");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) return { success: false, error: "Configuration Error: Missing URL" };
    if (!supabaseServiceKey) return { success: false, error: "Configuration Error: Missing Service Role Key" };

    // Initialize Admin Client (Bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    try {
        const { error } = await supabase.from("feedback").insert({
            rating: 1,
            comment: `(Lead Magnet) ${comment}`,
            email: email
        });

        if (error) {
            console.error("Supabase Write Error:", error);
            return { success: false, error: `DB Error: ${error.message}` };
        }

        return { success: true };
    } catch (e: any) {
        console.error("Unexpected Error:", e);
        return { success: false, error: `Exception: ${e.message || e}` };
    }
}
