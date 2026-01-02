"use server";

import { createClient } from "@supabase/supabase-js";

export async function trackEvent(eventType: string, details: any = {}) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) return;

    // Fire and forget (don't await strictly if not needed, but here we await for safety)
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false }
    });

    try {
        await supabase.from("analytics_events").insert({
            event_type: eventType,
            details: details
        });
    } catch (e) {
        console.error("Tracking Error:", e);
    }
}
