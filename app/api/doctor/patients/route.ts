import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
// import { Prisma } from "@prisma/client";
import prisma from "@/app/lib/dbConnect";

export async function GET(request: Request) {

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "DOCTOR") {
        return Response.json({
            success: false,
            message: "Unauthorized",
        }, { status: 401 })
    }

    try {
        
        const patients = await prisma.user.findMany({
            where: {
                id: {
                    in: (
                        await prisma.prescription.findMany({
                            where: { doctorId: session.user.id },
                            select: { userId: true },
                            distinct: ["userId"], // Get unique user IDs
                        })
                    ).map((p) => p.userId),
                },
            },
            select: {
                id: true,
                name: true,
                age: true,
                userUniqueId: true,
                email: true,
                prescriptions: {
                    select: {
                        id: true,
                        createdAt: true,
                        medication: true,
                        notes: true,
                    },
                },
            },
        });

        return Response.json({
            success: true,
            message: "successfully Fetch patients",
            patients,
        }, { status: 201 })

    } catch (error) {
        console.error("Error fetching patients:", error);
        return Response.json({
            success: false,
            message: "Internal Server Error",
        }, { status: 500 })
    }


}