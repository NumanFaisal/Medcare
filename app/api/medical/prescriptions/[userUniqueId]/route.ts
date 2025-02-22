import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/app/lib/dbConnect";

export async function GET(request: Request, { params }: { params: { userUniqueId: string } }) {

    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return Response.json({
                success: false,
                message: "Unauthorized",
            }, { status: 401 });
        }

        if (session.user.role !== "DOCTOR" && session.user.role !== "MEDICAL") {
            return Response.json({
                success: false,
                message: "Forbidden: Only doctors and medical shops can view prescriptions",
            }, { status: 403 });
        }

        const { userUniqueId } = params;

        const user = await prisma.user.findUnique({
            where: { userUniqueId },
            select: { id: true }
        });

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found",
            }, { status: 404 });
        }

        const prescriptions  = await prisma.prescription.findMany({
            where: { userId: user.id },
        });

        if (!prescriptions.length) {
            return Response.json({
                success: false,
                message: "No prescriptions found",
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            message: "Prescriptions founded",
            prescriptions,
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching prescriptions:", error);
        return Response.json({
            success: false,
            message: "Something went wrong",
        }, { status: 500 });
    }
}