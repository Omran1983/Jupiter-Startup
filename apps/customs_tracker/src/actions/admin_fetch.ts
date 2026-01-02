"use server";

import { createClient } from "@supabase/supabase-js";

export async function fetchFeedbackAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        return { success: false, error: "Missing Credentials" };
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false }
    });

    try {
        const { data, error } = await supabase
            .from("feedback")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Admin Fetch Error:", error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
