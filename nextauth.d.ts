import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user?: {
            id?: string; // Add the `id` property to the user object
        } & DefaultSession["user"];
    }
}
