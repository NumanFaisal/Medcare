import { PrismaClient, Role } from "@prisma/client"
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth-options";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { role: string } }) {
    
    try {

        const { role } = params; //Extract role from the URL path

        if (!role) {
            return Response.json({
                success: false,
                message: "Role is required"
            }, { status: 400 })
        }

        //get the session
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return Response.json({
                success: false,
                message: "Unauthorized. Please log in.",
            }, { status: 401});
        }

        const email = session.user.email ?? undefined;

        // Validate the role against the Role enum
    if (!Object.values(Role).includes(role as Role)) {
        return Response.json({
            sucess: false,
            message: "Invalid role",
        }, { status: 400 });
    }  

         // Fetch the user based on the role 
        let profile;

        switch (role) {
            case "USER":
                profile = await prisma.user.findUnique({
                    where: { email },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        userUniqueId: true,
                        age: true, 
                        createdAt: true,
                    },
                });
                break;

            case "DOCTOR":
                profile = await prisma.doctor.findUnique({
                    where: { email },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        qualifications: true,
                        experiences: true,
                        specialization: true,
                        description: true,
                        age: true,
                        createdAt: true,
                    },
                });
                break;

            case "MEDICAL":
                profile = await prisma.medical.findUnique({
                    where: { email },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        address: true,
                        createdAt: true,
                    },
                });
                break;
            
            default:
                return Response.json({
                    success: false,
                    message: "Invalid role.",
                }, { status: 400});
        }

        if (!profile) {
            return Response.json({
                success: false,
                message: `${role.charAt(0).toUpperCase() + role.slice(1)} not found.`,
                profile,
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            message: "Profile fetched successfully.",
            profile
        }, { status: 200 })
    } catch (error) {
        console.error("Error handling profile fetch:", error);
        return Response.json({
            success: false,
            message: "An unexpected error occurred.",
            error: error instanceof Error ? error.message : String(error),
        }, { status: 500 });
    }
}