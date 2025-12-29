import { z } from "zod";

/** Customs Tracker (MVP) input validation */
export const CustomsRunInputSchema = z.object({
    carrier: z.string().min(2).max(40),
    trackingNumber: z.string().min(6).max(60),
    destinationCountry: z.string().min(2).max(2), // ISO2 recommended
    orderValue: z.number().nonnegative().optional(),
    currency: z.string().min(3).max(3).optional(),
});

export type CustomsRunInput = z.infer<typeof CustomsRunInputSchema>;
