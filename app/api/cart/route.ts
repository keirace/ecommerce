import { NextResponse } from "next/server";
import { createCart, getCart, getCartItems } from "@/lib/actions/cart.actions";
import { getCurrentUser, getGuestBySessionToken } from "@/lib/actions/auth.actions";
import { cookies } from "next/headers";

export async function GET() {

	const userResp = await getCurrentUser(); // returns { ok, user? }
	let guest = null;

	if (!userResp.ok) {
		// must have guest session which is initialized when adding to cart
		const cookieStore = await cookies();
		const guestToken = cookieStore.get("guest_session")?.value || null;
		guest = await getGuestBySessionToken(guestToken!);
	}

	if (!userResp.ok && !guest) {
		return NextResponse.json({ items: [] });
	}
	
	const cart = await getCart(userResp.user?.id ?? null, guest ? guest.id : null);
	let cartId: string | null = cart?.id;

	// If no cart exists, create one
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
