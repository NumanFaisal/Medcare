import { z } from "zod"

// Define the sign-up schema using Zod
export const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['USER', 'DOCTOR', 'MEDICAL']),
  userUniqueId: z.string().optional(), // Will be auto-generated for user
  age: z.number().min(0, 'Age must be a positive number').optional(),
  qualifications: z.array(z.string()).optional(),
  experiences: z.array(z.string()).optional(),
  specialization: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional() // Only for Medical type
});