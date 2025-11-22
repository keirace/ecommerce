import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-11-17.clover" });
const domain = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const POST = async (req: NextRequest) => {
    let session: Stripe.Checkout.Session;
	try {
        const { lineItems } = await req.json();
		session = await stripe.checkout.sessions.create({
			mode: "payment",
			payment_method_types: ["card", "klarna", "link","affirm"],
			line_items: lineItems,
			ui_mode: "custom",
			return_url: `${domain}/checkout/complete?session_id={CHECKOUT_SESSION_ID}`,
		});
	} catch (error) {
		console.error("Error creating checkout session:", error);
		return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
	}
	return NextResponse.json({ clientSecret: session.client_secret });
};

export const GET = async (req: NextRequest) => {
	const session = await stripe.checkout.sessions.retrieve(req.nextUrl.searchParams.get("session_id")!, { expand: ["payment_intent"] });

	return NextResponse.json({
		status: session.status,
		payment_status: session.payment_status,
        amount_total: session.amount_total,
        date_created: session.created,
        payment_intent_id: session.payment_intent ? (session.payment_intent as Stripe.PaymentIntent).id : null,
	});
};
