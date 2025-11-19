'use client'

import { getGuestSession } from "./actions/auth.actions";

export async function ensureGuestSession(): Promise<{ ok: boolean; sessionToken: string | null; }> {
	const response = await getGuestSession();
	const token = response.token;
	console.log("Current session in ensureGuestSession:", token);

	if (!token) {
		const response = await fetch("/api/auth/guest", { method: "POST", credentials: "include" });
		const data = await response.json();
		console.log("Created guest session:", data);
		return data;
	}
	return { ok: true, sessionToken: token };
}