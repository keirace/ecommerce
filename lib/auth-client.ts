import { createAuthClient } from "better-auth/react"
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
})

export const { signIn, signUp, useSession } = authClient