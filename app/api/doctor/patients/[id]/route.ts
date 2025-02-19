import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/app/lib/dbConnect";

export async function GET(request: Request, { params }: { params: { id: string } }) {

    const session = await getServerSession(authOptions);
    if (!session) {
        return Response.json({
            success: false,
            message: "Unauthorized",
        }, { status: 401 })
    }

    const { id } = params;

    try {
        const patient = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                userUniqueId: true,
                createdAt: true,
            },
        });

        if (!patient) {
            return Response.json({
                success: false,
                message: "Patient not found",
            }, { status: 404 })
        }

        return Response.json({
            success: true,
            message: "Patient found",
            patient
        }, { status: 200 })

    } catch (error) {
        console.error("Error fetching patient details:", error);
        return Response.json({
            success: false,
            message: "Internal Server Error",
        }, { status: 500 })
    }

}