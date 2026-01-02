"use server";

import { createClient } from "@supabase/supabase-js";

export async function fetchDashboardData() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        return { success: false, error: "Missing Credentials" };
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false }
    });

    try {
        // 1. Fetch Feedback / Leads
        const { data: leads, error: leadsError } = await supabase
            .from("feedback")
            .select("*")
            .order("created_at", { ascending: false });

        // 2. Fetch Analytics (Checkout Clicks, Reports)
        const { data: analytics, error: analyticsError } = await supabase
            .from("analytics_events")
            .select("*")
            .order("created_at", { ascending: false });

        if (leadsError) console.error("Leads Error:", leadsError);
        if (analyticsError && !analyticsError.message.includes("does not exist")) console.error("Analytics Error:", analyticsError);

        return {
            success: true,
            data: {
                leads: leads || [],
                events: analytics || []
            }
        };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
