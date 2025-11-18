"use server";
import { auth, sessionCookieOptions } from "../auth";
import { cookies, headers } from "next/headers";
import { db } from "../db";
import * as schema from "../../database/index";
import { eq, and, lt } from "drizzle-orm";
import { randomUUID } from "crypto";

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

export async function signUp(formData: FormData) {
	const rawData = {
		name: formData.get("name") as string,
		email: formData.get("email") as string,
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

// export async function createGuestSession() {
// 	const cookiesStore = await cookies();
// 	const existing = cookiesStore.get("guest_session");
// 	if (existing) {
// 		return { ok: true, sessionToken: existing.value, id: null };
// 	}
// 	// const existing = await auth.api.getSession({
// 	// 	headers: await headers(), // pass the headers
// 	// });
// 	// if (existing) {
// 	// 	return { ok: true, sessionToken: existing.session.token, id: existing.user?.id || null };
// 	// }


// 	return { ok: false, sessionToken: guestSessionToken, id: guest.id || null };
// }

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
	const guestSession = await db.delete(schema.guests).where(and(eq(schema.guests.sessionToken, sessionToken), lt(schema.guests.expiresAt, new Date())));

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
}
