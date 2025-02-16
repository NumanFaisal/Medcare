import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/app/lib/dbConnect";
import { prescriptionSchema } from "@/app/schemas/prescriptionSchema";


export async function POST(request: Request) {

    try {
        
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "DOCTOR") {
            return Response.json({
                success: false,
                message: "Unauthorized"
            },{ status: 403 });
        }

        // Parse & Validate Request body
        const body = await request.json();
        const validatedData = prescriptionSchema.parse(body);

        // check if pattient exists
        const user = await prisma.user.findUnique({
            where: { id: validatedData.userId },
        });

        if (!user) {
            return Response.json({
                success: false,
                message: "Patient not found",
            }, { status: 404 });
        }

        // create the prescription 
        const prescription = await prisma.prescription.create({
            data: {
                doctorId: session.user.id,
                userId: validatedData.userId,
                medication: validatedData.medication, // store as string[]
                notes: validatedData.notes
            },
        });

        return Response.json({
            success: true,
            message: "Prescription created successfully",
            prescription,
        }, { status: 201 });

    } catch (error) {
        console.error(error);
        return Response.json({
            success: false,
            message: "Internal Server Error",
        }, { status: 400 })
    }

}