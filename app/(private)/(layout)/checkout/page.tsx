"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  Check,
  ShieldCheck,
  Lock,
  CreditCard,
  ChevronRight,
  AlertCircle,
  Crown,
  FileText,
  Calendar,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/app/redux/hooks";
import { createStripeCheckoutSession } from "@/lib/stripe-checkout";
import Link from "next/link";

const GOLD_FEATURES = [
  "32 Featured Listings for high-priority placement",
  "75+ brand banner Ads on key sections",
  "48 premium social media posts",
  "16 high-quality reels / videos",
  "65–95 Quality Leads per 4 months",
  "Strong organic + paid amplification",
  "Priority growth support & performance optimization",
];

const TERMS = [
  {
    title: "Subscription Duration",
    body: "The Gold Plan is a 4-month (120-day) subscription starting from the date of successful payment. The plan does not auto-renew unless you explicitly choose to renew.",
  },
  {
    title: "Refund Policy",
    body: "Payments are non-refundable once the plan is activated and creative production has begun. In case of a technical billing error, contact our support within 48 hours.",
  },
  {
    title: "Deliverables Timeline",
    body: "Social media creatives and reels are delivered progressively over the 4-month period. Lead generation campaigns activate within 5–7 business days after onboarding.",
  },
  {
    title: "Account Responsibilities",
    body: "You are responsible for providing accurate business information during onboarding. Throttle Connect reserves the right to suspend accounts violating marketplace policies.",
  },
  {
    title: "Cancellation",
    body: "You may request plan cancellation at any time. Access to premium features continues until the end of the paid billing period. No partial refunds are issued.",
  },
  {
    title: "Data & Privacy",
    body: "Your business data is stored securely and will not be shared with third parties outside of campaign execution. See our Privacy Policy for full details.",
  },
];

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);

  const plan = searchParams.get("plan") ?? "gold";
  const cancelled = searchParams.get("cancelled") === "true";

  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedTerm, setExpandedTerm] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user, router]);

  const handlePayment = async () => {
    if (!agreed) {
      setError("Please accept the terms and conditions before proceeding.");
      return;
    }
    if (!user?.userId) {
      setError("You must be signed in to proceed.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = await createStripeCheckoutSession(user.userId, "gold");
      window.location.assign(url);
    } catch (err: any) {
      setError(err.message ?? "Failed to initiate payment. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold mb-4 border border-amber-200">
            <Crown className="w-4 h-4" />
            Gold Plan Checkout
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#0B2447]">
            Complete Your Order
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Review the terms and billing summary before proceeding to secure payment.
          </p>
        </motion.div>

        {/* Cancelled notice */}
        {cancelled && (
          <div className="mb-6 rounded-2xl bg-orange-50 border border-orange-200 p-4 flex items-center gap-3 text-orange-800 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            Payment was cancelled. You can try again whenever you&apos;re ready.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Terms */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 space-y-4"
          >
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <FileText className="w-5 h-5 text-[#19376D]" />
                <h2 className="text-lg font-bold text-[#0B2447]">
                  Terms & Conditions
                </h2>
              </div>

              <div className="space-y-3">
                {TERMS.map((term, i) => (
                  <div
                    key={i}
                    className="border border-slate-100 rounded-2xl overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setExpandedTerm(expandedTerm === i ? null : i)
                      }
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-semibold text-sm text-[#0B2447]">
                        {term.title}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          expandedTerm === i ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    {expandedTerm === i && (
                      <div className="px-4 pb-4 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                        {term.body}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Agree checkbox */}
              <label className="flex items-start gap-3 mt-6 cursor-pointer group">
                <div
                  onClick={() => setAgreed(!agreed)}
                  className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                    agreed
                      ? "bg-[#19376D] border-[#19376D]"
                      : "border-slate-300 group-hover:border-[#19376D]"
                  }`}
                >
                  {agreed && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm text-slate-600 leading-relaxed">
                  I have read and agree to the{" "}
                  <strong className="text-[#0B2447]">Terms & Conditions</strong>{" "}
                  above. I understand the subscription duration, refund policy,
                  and deliverables timeline.
                </span>
              </label>
            </div>

            {/* Security note */}
            <div className="flex items-center gap-3 px-5 py-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
              Payments are secured by Stripe. Throttle Connect never stores
              card details. Your data is encrypted end-to-end.
            </div>
          </motion.div>

          {/* Right: Order summary */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Plan card */}
            <div className="bg-gradient-to-br from-[#0B2447] to-[#19376D] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-full" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-amber-400/20 rounded-xl">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </div>
                  <span className="font-bold text-lg">Gold Plan</span>
                </div>

                <div className="mb-4">
                  <div className="text-blue-200/70 text-xs line-through mb-0.5">
                    Rs. 104,000
                  </div>
                  <div className="text-4xl font-extrabold">Rs. 83,000</div>
                  <div className="text-blue-200 text-sm mt-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    4-month plan · Rs. 20,750/month
                  </div>
                </div>

                <div className="bg-white/10 rounded-2xl p-4 mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-blue-200">Subtotal</span>
                    <span className="font-semibold">Rs. 83,000</span>
                  </div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-blue-200">Discount (20%)</span>
                    <span className="font-semibold text-emerald-300">
                      – Rs. 21,000
                    </span>
                  </div>
                  <div className="border-t border-white/20 pt-2 flex justify-between font-bold">
                    <span>Total Due</span>
                    <span>Rs. 83,000</span>
                  </div>
                </div>

                <ul className="space-y-2">
                  {GOLD_FEATURES.slice(0, 4).map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-xs text-blue-100"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                  <li className="flex items-center gap-2 text-xs text-blue-200/60">
                    <Zap className="w-3.5 h-3.5 shrink-0" />
                    +{GOLD_FEATURES.length - 4} more benefits included
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-3">
              {error && (
                <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <Button
                onClick={handlePayment}
                disabled={loading}
                className="w-full h-13 rounded-2xl bg-[#19376D] hover:bg-[#0B3A5B] text-white font-bold text-base shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Preparing payment…
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Make Payment
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                256-bit SSL · Powered by Stripe
              </div>

              <Link
                href="/pricing"
                className="block text-center text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                ← Back to pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8fafc] flex items-center justify-center"><span className="text-slate-400 text-sm">Loading checkout…</span></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
