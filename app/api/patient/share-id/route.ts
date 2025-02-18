import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/app/lib/dbConnect";
import { z } from "zod";

const bodySchema = z.object({
    medicalShopId: z.string().uuid(), // The medical shop ID to share the unique ID with
});

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return Response.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        // Parse the request body to get the medical shop ID
        const { medicalShopId } = bodySchema.parse(await request.json());

        // Fetch the user from the session
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!user) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Get the userUniqueId from the user data
        const userUniqueId = user.userUniqueId;

        // For now, we'll assume sharing the userUniqueId suffices
        return Response.json({ 
            success: true,
            userUniqueId 
        },{ status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ success: false, 
            message: "Internal Server Error" 
        },{ status: 500 });
    }
}
