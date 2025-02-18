import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/app/lib/dbConnect";
import { z } from "zod";

const paramsSchema = z.object({
    id: z.string().uuid(),
})


export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return Response.json({
                success: false,
                message: "Unauthorized"
            }, { status: 401 })
        }

        const { id } = paramsSchema.parse(params);

        const appointment = await prisma.appointment.findUnique({
            where: { id },
        });

        if (!appointment) {
            return Response.json({
                success: false,
                message: "Appointment not found"
            }, { status: 404 });
        }

        if (appointment.userId !== session.user.id) {
            return Response.json({
                success: false,
                message: "Forbidden"
            }, { status: 403 })
        }

        await prisma.appointment.delete({ where: { id } });

        return Response.json({
            success: true,
            message: "Appointment canceled successfully"
        }, { status: 200 })

    } catch (error) {
        console.log(error);
        return Response.json({
            success: false,
            message: "Intenal Server Error",
            
        }, { status: 500 });
    }
}