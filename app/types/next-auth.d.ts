import "next-auth";

declare module "next-auth" {
interface Session {
    user: {
        id: string;
        role: "USER" | "DOCTOR" | "MEDICAL"; // Match your Prisma enum
        name?: string | null;
        email?: string | null;
        image?: string | null;
    }
}

interface User {
    id: string;
    role: "USER" | "DOCTOR" | "MEDICAL";
    name?: string | null;
    email?: string | null;
    image?: string | null;
}
}
declare module 'next-auth/jwt' {
    interface JWT {
        id?: string;
        email?: string;
        role?: string;
    }
}

