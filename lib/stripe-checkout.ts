export type CheckoutPlan = "gold";

export async function createStripeCheckoutSession(
  uid: string,
  plan: CheckoutPlan,
): Promise<string> {
  const res = await fetch("/api/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      uid,
      plan,
      successUrl: `${window.location.origin}/checkout/success`,
      cancelUrl: `${window.location.origin}/checkout?plan=${plan}&cancelled=true`,
    }),
  });

  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(data.error ?? "Failed to create checkout session.");
  }

  if (!data.url) {
    throw new Error("No checkout URL returned from server.");
  }

  return data.url as string;
}
