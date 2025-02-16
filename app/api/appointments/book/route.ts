import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { bookAppointmentSchema } from "@/app/schemas/bookAppointmentSchema";
import prisma from "@/app/lib/dbConnect";

export async function POST(request: Request) {

    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'USER') {
            return Response.json({
                success: false,
                message: "Unauthorized"
            }, { status: 401 });
        }

        const body =  await request.json();
            const validatedData = bookAppointmentSchema.parse(body);

            const appointment = await prisma.appointment.create({
                data: {
                    userId: session.user.id,
                    doctorId: validatedData.doctorId,
                    date: new Date(validatedData.date),
                    reason: validatedData.reason,
                },
            });

            return Response.json({
                success: true,
                message: "Appointment Done",
                appointment
            }, { status: 201 });
    } catch (error) {
        const message = console.log(error);
        return Response.json({
            success: false,
            message: message,
            
        }, { status: 400 });
    }
}