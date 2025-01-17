import { prismaClient } from "@/app/lib/db";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
    ],
    secret: process.env.AUTH_SECRET ?? "Secret",
    callbacks: {
        async signIn(params) {
            if (!params.user.email) {
                console.log("No email found in user object", params.user);
                return false;
            }

            try {
                let user = await prismaClient.user.findUnique({
                    where: {
                        email: params.user.email,
                    },
                });

                if (!user) {
                    user = await prismaClient.user.create({
                        data: {
                            email: params.user.email,
                            provider: "Google",
                        },
                    });
                }

                return true;
            } catch (e) {
                console.error("Error in sign-in callback:", e);
                return false;
            }
        },

        // Add user ID to the session object
        async session({ session }) {
            try {
                const dbUser = await prismaClient.user.findUnique({
                    where: { email: session.user?.email as string },
                });
                console.log(dbUser);
                if (dbUser) {
                    (session.user as { id?: string }).id = dbUser.id;
                }
                console.log(session);
            } catch (e) {
                console.error("Error in session callback:", e);
            }
            console.log(session);

            return session;
        },

        async jwt({ token, user }) {
            if (user) {
                token.id = user.id; // Attach the user ID to the JWT
            }
            return token;
        },
    },
});

export { handler as GET, handler as POST };
