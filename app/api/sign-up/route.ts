import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcryptjs";
import { signupSchema } from "@/app/schemas/signupSchema"
import { NextResponse } from "next/server";
// import { ZodError } from "zod"; // Import ZodError from zod



const prisma = new PrismaClient();

export async function POST(request: Request) {
    
    // parse request body
    const body = await request.json();
    console.log("Received body:", body);

    try {
        const data = signupSchema.parse(body);  // Validate body with Zod schema

        // hash the password before saving it
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Generate a user Unique Id id not provided
        const userUniqueId = data.userUniqueId || `user-${Math.random().toString(36).substr(2, 9)}`;

        // Create the user based on the role 

        let newUser;

        if (data.role === "USER") {
            newUser = await prisma.user.create({
                data: {
                    name: data.name,
                    email: data.email,
                    password: hashedPassword,
                    role: Role.USER,
                    userUniqueId,
                    age: data.age || 0,
                },
            });
        } else if (data.role === "DOCTOR") {
            newUser = await prisma.doctor.create({
                data: {
                    name: data.name,
                    email: data.email,
                    password: hashedPassword,
                    role: Role.DOCTOR,
                    qualifications: data.qualifications || [],
                    experiences: data.experiences || [],
                    specialization: data.specialization || '',
                    description: data.description || '',
                    age: data.age || 0,
                },
            });
        } else if (data.role === 'MEDICAL') {
            newUser = await prisma.medical.create({
                data: {
                    name: data.name,
                    email: data.email,
                    password: hashedPassword,
                    role: Role.MEDICAL,
                    address: data.address || '',
                },
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "Invalid role",
            }, { status: 400 });
        }

        // Respond with the newly created user
        return NextResponse.json({
            success: true,
            message: "User created successfully",
            user: newUser
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "An unexpected error occurred",
            error: error instanceof Error ? error.message : String(error),
        }, { status: 400 });
    }
}