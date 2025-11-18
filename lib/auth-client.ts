import { createAuthClient } from "better-auth/react";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production" && typeof process.env.NEXT_PUBLIC_API_URL === "undefined") {
	dotenv.config({ path: "/.env.local" });
}

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
});

export const { signIn, signUp, useSession, getSession } = authClient;
