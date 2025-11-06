"use server";
import { auth, sessionCookieOptions } from "./auth";
import { cookies, headers } from "next/headers";
import { db } from "./db";
import * as schema from "../database/index";
import { eq, and, lt, is } from "drizzle-orm";
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

export async function createGuestSession() {
	const cookiesStore = await cookies();
	const existing = cookiesStore.get("guest_session");
	if (existing) {
		return { ok: true, sessionToken: existing.value };
	}

	const guestSessionToken = randomUUID();
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

	await db.insert(schema.guests).values({
		sessionToken: guestSessionToken,
		expiresAt: expiresAt,
	});

	cookiesStore.set("guest_session", guestSessionToken, sessionCookieOptions);

	return { ok: true, sessionToken: guestSessionToken };
}

/**
 * Fetches the current guest session based on the guest_session cookie.
 * @returns
 */
export async function guestSession() {
	const cookiesStore = await cookies();
	const sessionToken = cookiesStore.get("guest_session")?.value;
	if (!sessionToken) {
		return null;
	}

	const guestSession = await db.delete(schema.guests).where(and(eq(schema.guests.sessionToken, sessionToken), lt(schema.guests.expiresAt, new Date())));

	return { ok: true, session: guestSession };
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
		return session?.user ?? null;
	} catch (error) {
		console.error("Error fetching session:", error);
		return null;
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
