import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { PrismaClient } from "@prisma/client";
import { updateProfileSchema } from "../../../schemas/updateProfileSchema";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
        return Response.json({
            error: "Unauthorized",
        }, { status: 401 });
    }

    

    const { role, id } = session?.user;
    const body = await request.json();

    const parseData = updateProfileSchema.safeParse(body);
    if (!parseData.success) {
        return Response.json({
            error: "Invalid data", 
        }, { status: 400 });
    }

    try {
        // Define allowed fields based on roles
        let updateData: Record<string, any> = {};

        // Check if email is unique before updating
        if (body.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email: body.email },
            });

            if (existingUser && existingUser.id !== id) {
                return Response.json({ 
                    error: "Email is already in use",
                }, { status: 400 });
            }

            updateData.email = body.email;
        }

        // Hash password before saving
        if (body.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(body.password, salt);
        }

        if (role === "USER") {
            updateData = {
                name: body.name,
                email: body.email,
                password: body.password, 
                age: body.age,
                description: body.description,
                address: body.address,
            };
        } else if (role === "DOCTOR") {
            updateData = {
                name: body.name,
                email: body.email,
                password: body.password,
                age: body.age,
                qualifications: body.qualifications,
                experiences: body.experiences,
                specialization: body.specialization,
                description: body.description,
                address: body.address,
            };
        } else if (role === "MEDICAL") {
            updateData = {
                name: body.name,
                email: body.email,
                password: body.password,
                age: body.age,
                address: body.address
            };
        } else {
            return Response.json({
                error: "Invalid data", 
            }, { status: 403 });
        }

        // Remove undefined fields to avoid overwriting with null
        Object.keys(updateData).forEach((key) => {
            if (updateData[key] === undefined) delete updateData[key];
        });

        // Update user profile
        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
        });

        return Response.json({
            success: true,
            user: updatedUser
        }, { status: 200 });

    } catch (error) {
        
        console.error(error);
        return Response.json({
            error: "Server error", 
        }, { status: 500 });
    }
}