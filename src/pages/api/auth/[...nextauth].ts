import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../db/prismaClient";
import bcrypt from 'bcryptjs';


export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {

                if (!credentials || !credentials.email || !credentials.password) {
                    return null;
                }

                const user = await prisma.vartotojas.findUnique({
                    where: { El_pastas: credentials.email }
                });


                if (user && bcrypt.compareSync(credentials.password, user.Slaptazodis)) {
                    return {
                        id: user.VartotojoID.toString(),
                        name: user.Vardas,
                        email: user.El_pastas,
                        role: user.Role
                    };
                } else {
                    return null;
                }
            }
        }),
    ],
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: '/login',
        signOut: '/',
        error: '/error',
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        session({ session, token }) {
            if (session.user) {
                session.user.id = String(token.id);
                session.user.role = String(token.role);
            }
            return session;
        },
    },

});
