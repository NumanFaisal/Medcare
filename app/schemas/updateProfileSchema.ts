import { z } from "zod";



export const updateProfileSchema = z.object({
    name: z.string().min(2).max(50).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).max(100).optional(),
    age: z.number().int().positive().optional(),
    qualifications: z.string().optional(),
    experiences: z.string().optional(),
    specialization: z.string().optional(),
    description: z.string().optional(),
    address: z.string().optional(),
})