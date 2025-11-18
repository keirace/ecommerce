"use server";
import { auth, sessionCookieOptions } from "../auth";
import { cookies, headers } from "next/headers";
import { db } from "../db";
import * as schema from "../../database/index";
import { eq, and, lt } from "drizzle-orm";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function signIn(formData: FormData) {
	const rawData = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};
	const response = await auth.api.signInEmail({ body: rawData });
	return { ok: true, userId: response.user?.id };
}

export async function signOut() {
	await auth.api.signOut({ headers: await headers() });
	return { ok: true };
}

const generateUsername = (email: string) => {
	const baseUsername = email.split('@')[0];
	const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4 digit random number
	return `${baseUsername}${randomSuffix}`;
};

export async function signUp(formData: FormData) {
	const rawData = {
		name: formData.get("name") as string,
		email: formData.get("email") as string,
		username: generateUsername(formData.get("email") as string),
		password: formData.get("password") as string,
	};
	const response = await auth.api.signUpEmail({ body: rawData });
	await upgradeGuestToUser();
	return { ok: true, userId: response.user?.id };
}

/**
 * Checks if an email already exists in the database.
 * @param email
 * @returns
 */
export async function doesEmailExist(formData: FormData) {
	const email = formData.get("email") as string;
	const existingUser = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
	console.log("Existing user check for email", email, ":", existingUser);
	return { ok: true, exists: existingUser.length > 0 };
}

/**
 * Fetches the current guest session based on the guest_session cookie.
 * @returns
 */
export async function getGuestSession() {
	const cookiesStore = await cookies();
	const sessionToken = cookiesStore.get("guest_session")?.value;
	console.log("Fetching guest session for token:", sessionToken);
	if (!sessionToken) {
		return { ok: false, token: null };
	}

	// Clean up expired guest sessions
	await db.delete(schema.guests).where(and(eq(schema.guests.sessionToken, sessionToken), lt(schema.guests.expiresAt, new Date())));

	return { ok: true, token: sessionToken || null };
}

export async function getGuestBySessionToken(sessionToken: string) {
	const guest = await db.select().from(schema.guests).where(eq(schema.guests.sessionToken, sessionToken)).limit(1).then(res => res[0] || null);
	return guest;
}

/**
 * Fetches the current logged in user based on the session.
 * @returns
 */
export async function getCurrentUser() {
	try {
		const session = await auth.api.getSession({
			headers: await headers(), // you need to pass the headers object.
		});
		console.log("Fetched current session:", session);
		return session?.user ? { ok: true, user: session?.user } : { ok: false, user: null };
	} catch (error) {
		console.error("Error fetching session:", error);
		return { ok: false, user: null };
	}
}

export async function deleteGuestSession() {
	// Implement guest session deletion logic here
}

export async function upgradeGuestToUser() {
	const cookiesStore = await cookies();
	const sessionToken = cookiesStore.get("guest_session")?.value;
	if (!sessionToken) {
		return;
	}

	await db.delete(schema.guests).where(and(eq(schema.guests.sessionToken, sessionToken), lt(schema.guests.expiresAt, new Date())));

	// Delete the guest session cookie
	cookiesStore.delete("guest_session");
}

export async function mergeGuestCartToUser() {
	await upgradeGuestToUser();
}export async function ensureGuestSession(): Promise<{ ok: boolean; sessionToken: string | null; }> {
    const response = await getGuestSession();
    const token = response.token;
    console.log("Current session in ensureGuestSession:", token);

    if (!token) {
        const response = await fetch(`${BASE_URL}/api/auth/guest`, { method: "POST", credentials: "include" });
        const data = await response.json();
        console.log("Created guest session:", data);
        return data;
    }
    return { ok: true, sessionToken: token };
}

