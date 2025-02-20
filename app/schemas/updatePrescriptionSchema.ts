import { z } from "zod";

export const updatePrescriptionSchema = z.object({
    medication: z.array(z.string()).optional(), // List of prescribed medication 
    notes: z.string().optional()// optional notes from the doctor
});