import { z } from "zod";


export const bookAppointmentSchema = z.object({
    doctorId: z.string().cuid(),
    date: z.string().datetime(),
    reason: z.string().optional(),
});