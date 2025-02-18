import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/app/lib/dbConnect";


export async function GET(request: Request) {

    try {

        const session = await getServerSession(authOptions);
        if(!session) {
            return Response.json({
                success: false,
                message: "Unauthorized"
            }, { status: 401 })
        }

        const userId = session.user.id;
        const role = session.user.role;

        if (role !== "USER" && role !== "DOCTOR") {
            return Response.json({
                success: false,
                message: "Forbidden"
            }, { status: 403 })
        }

        let appointment;

        if (role === "DOCTOR") {
            appointment = await prisma.appointment.findMany({
                where: { doctorId: userId },
                include: { doctor: true },
            });
        } else {
            appointment = await prisma.appointment.findMany({
                where: { userId: userId },
                include: { doctor: true},
            });
        }

        return Response.json({
            success: true,
            message: "Get appointment",
            appointment,
        }, { status: 200 })

    } catch (error) {
        const message = console.log(error);
        return Response.json({
            success: false,
            message: message,
            
        }, { status: 400 });
    }


}