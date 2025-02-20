import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/app/lib/dbConnect";
import { updatePrescriptionSchema } from "@/app/schemas/updatePrescriptionSchema";

export async function GET(request: Request, { params }: { params: { id: string } }) {

    
    try {

        const session = await getServerSession(authOptions);
        if (!session) {
            return Response.json({
                success: false,
                message: "Unauthorized",
            }, { status: 401 });
        }
        
        const { id } = params;

        const prescription = await prisma.prescription.findUnique({
            where: { id },
            include: {
                user: {
                    select: { id: true, name: true, email: true, userUniqueId: true },
                },
                doctor: {
                    select: { id: true, name: true },
                },
            },
        });

        if (!prescription) {
            return Response.json({
                success: false,
                message: "prescription not found",
            }, { status: 404 })
        }

        return Response.json({
            success: true,
            message: "Prescription found",
            prescription
        }, { status: 200 })


    } catch (error) {
        console.error("Error fetching prescription:", error);
        return Response.json({
            success: false,
            message: "Internal Server Error",
        }, { status: 500 })
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {

    
    try {
        
        const session = await getServerSession(authOptions);
        if (!session) {
            return Response.json({
                success: false,
                message: "Unauthorized",
            }, { status: 401 });
        }

        const id = params.id;
        const body = await request.json();
        const validatedData = updatePrescriptionSchema.safeParse(body);

        if (!validatedData.success) {
            return Response.json({
                success: false,
                message: "Invalid data",
                errors: validatedData.error.errors, // Send validation errors for debugging
            }, { status: 400 });
        }

        // Update Prescription
        const prescription = await prisma.prescription.update({
            where: { id },
            data: validatedData.data
        })

        return Response.json({
            success: true,
            message: "Prescription Updated",
            prescription
        }, { status: 200 })

    } catch (error) {
        console.error("Error updating prescription:", error);
        return Response.json({
            success: false,
            message: "Something went wrong",
        }, { status: 500 })
    }

}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "DOCTOR") {
            return Response.json({
                success: false,
                message: "Unauthorized",
            }, { status: 400 });
        }

        const id = params.id;

        //Check if prescription exists 
        const prescription = await prisma.prescription.findUnique({
            where: { id },
        });

        if (!prescription) {
            return Response.json({
                success: false,
                message: "Prescription not found",
            }, { status: 404 });
        }

        // Delete the prescription
        await prisma.prescription.delete({
            where: { id },
        });

        return Response.json({
            success: true,
            message: "Prescription deleted successfully",
        }, { status: 200 });

    } catch (error) {
        console.error("Error deleting prescription:", error);
        return Response.json({
            success: false,
            message: "Something went wrong",
        }, { status: 500 });
    }
}