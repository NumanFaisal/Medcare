import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/app/lib/dbConnect";
import { z } from "zod"

const paramsSchema = z.object({
    id: z.string().uuid(),
});

export async function GET(request: Request, { params }: { params: { id: string } }) {

    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return Response.json({
                success: false,
                message: "Unauthorized"
            }, { status: 401 })
        }

        const { id } = paramsSchema.parse(params);

        // Fetch the prescription from the database
        const prescription = await prisma.prescription.findUnique({
            where: { id },
            include: {
                doctor: true, // Optionally include doctor details
                user: true, // Optionally include user details
            },
        });

        return Response.json({
            success: true,
            prescription 
        },{ status: 200 });

    } catch (error) {
        console.log(error);
        return Response.json({
            success: false,
            message: "Internal Server Error",
        },{ status: 500 });

    }
}