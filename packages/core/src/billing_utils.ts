import type { SupabaseClient } from "@supabase/supabase-js";

export async function getActivePlanId(supabase: SupabaseClient, orgId: string): Promise<string | null> {
    const { data, error } = await supabase
        .from("subscriptions")
        .select("plan_id,status,current_period_end")
        .eq("org_id", orgId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error || !data) return null;
    const status = (data as any).status as string;
    if (!["active", "trialing"].includes(status)) return null;
    return (data as any).plan_id as string;
}

export async function canAccessFeature(supabase: SupabaseClient, orgId: string, feature: string): Promise<boolean> {
    const { data, error } = await supabase
        .from("org_entitlements")
        .select("enabled")
        .eq("org_id", orgId)
        .eq("feature", feature)
        .maybeSingle();

    if (error || !data) return false;
    return Boolean((data as any).enabled);
}
