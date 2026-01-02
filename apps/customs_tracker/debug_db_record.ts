
import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

// Load env from .env.local
const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!sbUrl || !sbKey) {
    console.error("Missing Env Vars");
    process.exit(1);
}

const supabase = createClient(sbUrl, sbKey);
const id = "cac73f75-bea2-4638-bc61-a12baa795a6e";

async function debugRecord() {
    console.log(`Checking Record: ${id}`);
    const { data, error } = await supabase
        .from("runs")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("DB Error:", error);
    } else {
        console.log("Found Record:");
        console.log("Input Payload:", JSON.stringify(data.input_payload, null, 2));
        console.log("Output Summary:", JSON.stringify(data.output_summary, null, 2));
    }
}

debugRecord();
