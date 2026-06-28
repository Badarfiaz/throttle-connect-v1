import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_FIREBASE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia",
});

const GOLD_PRODUCT_ID = "prod_UmujeU8znJd5Kh";

export async function POST(req: NextRequest) {
  try {
    const { uid, successUrl, cancelUrl } = await req.json();

    if (!uid) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    // Fetch the product's default price from Stripe
    const product = await stripe.products.retrieve(GOLD_PRODUCT_ID);
    const priceId = product.default_price as string | null;

    if (!priceId) {
      return NextResponse.json(
        { error: "No default price found for Gold product. Please configure a price in Stripe." },
        { status: 400 },
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl || `${req.nextUrl.origin}/checkout/success`,
      cancel_url: cancelUrl || `${req.nextUrl.origin}/checkout?plan=gold&cancelled=true`,
      metadata: {
        plan: "gold",
        uid,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
