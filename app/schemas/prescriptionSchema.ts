import { z } from "zod";


export const prescriptionSchema = z.object({
    userId: z.string().min(1, "Patient ID is required"),
    medication: z.array(z.string().min(1, "Medicine name is required")),
    notes: z.string().optional()
});