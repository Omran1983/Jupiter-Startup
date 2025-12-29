export type OrgRole = "owner" | "admin" | "member";

export interface Org {
    id: string;
    name: string;
    created_at: string;
}

export interface OrgMember {
    org_id: string;
    user_id: string;
    role: OrgRole;
    created_at: string;
}

export interface Workflow {
    id: string;
    org_id: string;
    name: string;
    description?: string | null;
    category?: string | null;
    is_active: boolean;
    created_at: string;
}

export interface Run {
    id: string;
    org_id: string;
    workflow_id: string;
    template_id?: string | null;
    user_id?: string | null;
    status: "created" | "running" | "succeeded" | "failed";
    input_payload: Record<string, unknown>;
    output_summary: Record<string, unknown>;
    error?: string | null;
    created_at: string;
}
