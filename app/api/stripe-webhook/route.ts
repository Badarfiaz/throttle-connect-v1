import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const stripe = new Stripe(process.env.NEXT_PUBLIC_FIREBASE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia",
});

function getAdminDb() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }
  return getFirestore();
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const body = await req.text();

  let event: Stripe.Event;

  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const uid = session.metadata?.plan === "gold" ? session.metadata?.uid : null;

    if (uid && session.payment_status === "paid") {
      const db = getAdminDb();
      const subscriptionStart = new Date();
      const subscriptionEnd = new Date(subscriptionStart);
      subscriptionEnd.setDate(subscriptionEnd.getDate() + 120);

      await db.collection("users").doc(uid).update({
        isGoldUser: true,
        subscriptionPlan: "gold",
        subscriptionStatus: "active",
        subscriptionStart: subscriptionStart.toISOString(),
        subscriptionEnd: subscriptionEnd.toISOString(),
        recentPayment: true,
      });
    }
  }

  return NextResponse.json({ received: true });
}
