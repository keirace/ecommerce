import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as schema from "@/database/index";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";

export async function POST() {
	const guestSessionToken = randomUUID();
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + 7);

	const [guest] = await db
		.insert(schema.guests)
		.values({
			sessionToken: guestSessionToken,
			expiresAt,
		})
		.returning({ id: schema.guests.id });

	const res = NextResponse.json({ ok: true, sessionToken: guestSessionToken, id: guest.id });

	// set httpOnly cookie on the response (adjust options as needed)
	res.cookies.set({
		name: "guest_session",
		value: guestSessionToken,
		httpOnly: true,
		sameSite: "strict",
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 60 * 24 * 7, // 7 days
		path: "/",
	});

	return res;
}