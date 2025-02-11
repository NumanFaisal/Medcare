import { z } from "zod";


export const prescriptionSchema = z.object({
    userId: z.string(),
    medication: z.array(z.string()),
    notes: z.string().optional()
});