import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createCart, getCart, getCartItems } from "@/lib/actions/cart.actions";
import { getCurrentUser, getGuestBySessionToken } from "@/lib/actions/auth.actions";

export async function GET() {
	const cookieStore = await cookies();
	const guestToken = cookieStore.get("guest_session")?.value || null;

	const userResp = await getCurrentUser(); // returns { ok, user? }
	const guest = userResp.ok ? null : await getGuestBySessionToken(guestToken || "");

	const cart = await getCart(userResp.user?.id ?? null, guest ? guest.id : null);
	let cartId: string | null = cart?.id;

	if (!cartId) {
		cartId = await createCart(userResp.user?.id ?? null, guest ? guest.id : null);
	}

	// Ensure cartId is set
	if (!cartId) {
		console.error("Cart ID is not available");
		return;
	}

	const items = cart ? await getCartItems(cart.id) : [];

	return NextResponse.json({ items });
}
