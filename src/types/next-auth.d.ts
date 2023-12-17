import NextAuth from "next-auth"

declare module "next-auth" {
    interface User {
        id: string;
        role: string;
        name: string;
        email: string;
    }

    interface Session {
        user?: User;
    }
}