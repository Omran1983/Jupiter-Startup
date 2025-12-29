import { z } from "zod";

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

/** Customs Tracker (MVP) input validation */
export const CustomsRunInputSchema = z.object({
    carrier: z.string().min(2).max(40),
    trackingNumber: z.string().min(6).max(60),
    destinationCountry: z.string().min(2).max(2), // ISO2 recommended
    orderValue: z.number().nonnegative().optional(),
    currency: z.string().min(3).max(3).optional(),
});

export type CustomsRunInput = z.infer<typeof CustomsRunInputSchema>;

/** Research Vault input validation */
export const VaultSaveSchema = z.object({
    dossierId: z.string().uuid(),
    type: z.enum(["link", "note", "file", "snippet"]),
    url: z.string().url().optional(),
    note: z.string().max(5000).optional(),
    tags: z.array(z.string().max(50)).optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
});

export type VaultSaveInput = z.infer<typeof VaultSaveSchema>;
