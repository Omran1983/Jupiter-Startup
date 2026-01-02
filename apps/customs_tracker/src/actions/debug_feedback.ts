"use server";

import { createClient } from "@supabase/supabase-js";

export async function runDiagnostics() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const checks: any = {
        env: {
            url_present: !!supabaseUrl,
            key_present: !!supabaseServiceKey,
            key_length: supabaseServiceKey?.length || 0
        }
    };

    if (!supabaseUrl || !supabaseServiceKey) {
        return { success: false, checks, error: "Missing Credentials" };
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false }
    });

    try {
        // 1. Check Connection & Table Existence
        const { count, error: countError } = await supabase
            .from("feedback")
            .select("*", { count: 'exact', head: true });

        checks.db_connection = !countError;
        checks.table_feedback_exists = !countError || !countError.message.includes("does not exist");
        checks.row_count = count;

        if (countError) {
            checks.error_details = countError;
            return { success: false, checks, error: countError.message };
        }

        // 2. Try an Insert (Test Record)
        const { error: insertError } = await supabase.from("feedback").insert({
            rating: 5,
            comment: "DIAGNOSTIC_TEST_RECORD",
            email: "test@internal.system"
        });

        checks.write_permission = !insertError;

        if (insertError) {
            checks.write_error = insertError;
            return { success: false, checks, error: insertError.message };
        }

        return { success: true, checks, message: "All Systems Go" };

    } catch (e: any) {
        return { success: false, checks, error: `Exception: ${e.message}` };
    }
}
