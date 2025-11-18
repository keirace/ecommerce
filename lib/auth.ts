import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "../database/index";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { nextCookies } from "better-auth/next-js";

dotenv.config({ path: ".env.local" });

export const sessionCookieOptions = {
	name: "session_token",
	options: {
		httpOnly: true,
		sameSite: "strict",
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 60 * 24 * 7, // 7 days
		path: "/",
	},
};

export const auth = betterAuth({
	secret: process.env.BETTER_AUTH_SECRET,
	url: process.env.BETTER_AUTH_URL,
	database: drizzleAdapter(db, { provider: "pg", schema: {
		user: schema.users,
		session: schema.sessions,
		account: schema.accounts,
		verification: schema.verifications,
	} }),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
	},
	socialProviders: {},
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
		cookieCache: {
			enabled: true,
			maxAge: 60 * 60 * 24 * 7, // 7 days
		},
	},
	cookies: {
		sessionToken: sessionCookieOptions,
	},
	advanced: {
		database: {
			generateId: () => uuidv4(), // Use UUID v4 for IDs
		},
	},
	plugins: [nextCookies()], // Allow better-auth to read cookies in server side Next.js environment
});
