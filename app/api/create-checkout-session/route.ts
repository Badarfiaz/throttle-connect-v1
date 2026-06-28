import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_FIREBASE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia",
});

const PRODUCT_IDS: Record<string, string | undefined> = {
  gold: process.env.NEXT_PUBLIC_STRIPE_GOLD_PRICE_ID,
  silver: process.env.NEXT_PUBLIC_STRIPE_SILVER_PRICE_ID,
  platinum: process.env.NEXT_PUBLIC_STRIPE_PLATINUM_PRICE_ID,
};

export async function POST(req: NextRequest) {
  try {
    const { uid, plan, successUrl, cancelUrl } = await req.json();

    if (!uid) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    const targetPlan = plan || "gold";
    const productId = PRODUCT_IDS[targetPlan];

    if (!productId) {
      return NextResponse.json({ error: `Invalid plan: ${targetPlan}` }, { status: 400 });
    }

    // Fetch the product's default price from Stripe
    const product = await stripe.products.retrieve(productId);
    const priceId = product.default_price as string | null;

    if (!priceId) {
      return NextResponse.json(
        { error: `No default price found for ${targetPlan} product. Please configure a price in Stripe.` },
        { status: 400 },
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl || `${req.nextUrl.origin}/checkout/success`,
      cancel_url: cancelUrl || `${req.nextUrl.origin}/checkout?plan=${targetPlan}&cancelled=true`,
      metadata: {
        plan: targetPlan,
        uid,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
