"use server";

import { createClient } from "@supabase/supabase-js";

export async function submitFeedback(comment: string, email: string) {
    console.log("Submit Feedback Action Triggered");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error("Missing Supabase Credentials (Service Role)");
        return { success: false, error: "Configuration Error" };
    }

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
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (e) {
        console.error("Unexpected Error:", e);
        return { success: false, error: "Internal Server Error" };
    }
}
