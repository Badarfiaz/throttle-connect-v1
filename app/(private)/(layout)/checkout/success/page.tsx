"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Crown,
  CheckCircle2,
  MessageCircle,
  Users,
  Sparkles,
  ArrowRight,
  Phone,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAppSelector } from "@/app/redux/hooks";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

const WHATSAPP_NUMBER = "923344444503";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi! I just subscribed to the Throttle Connect Gold Plan and need assistance with onboarding.",
);

const NEXT_STEPS = [
  {
    icon: Users,
    title: "Account Manager Assigned",
    desc: "A dedicated account manager from our team will contact you within 24–48 hours to begin your onboarding.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Sparkles,
    title: "Creative Production Starts",
    desc: "Our design team will start crafting your social media creatives and reels based on your brand information.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Clock,
    title: "Campaigns Go Live",
    desc: "Your featured listings and paid campaigns will activate within 5–7 business days after onboarding is complete.",
    color: "bg-emerald-50 text-emerald-600",
  },
];

export default function CheckoutSuccessPage() {
  const user = useAppSelector((s) => s.auth.user);

  // Mark payment flag in Firestore so dashboard can show the "team connecting" banner
  useEffect(() => {
    if (!user?.userId) return;
    const ref = doc(db, "users", user.userId);
    updateDoc(ref, {
      recentPayment: true,
      subscriptionStatus: "active",
      subscriptionPlan: "gold",
     }).catch(() => undefined);
  }, [user?.userId]);

  const openWhatsApp = () => {
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`,
      "_blank",
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-200 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center shadow-md">
              <Crown className="w-4 h-4 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold mb-4 border border-amber-200">
            <Crown className="w-4 h-4" />
            Gold Member
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#0B2447] mb-3">
            Payment Successful!
          </h1>
          <p className="text-gray-500 leading-relaxed">
            Welcome to Throttle Connect Gold,{" "}
            <strong className="text-[#0B2447]">
              {user?.name || "valued member"}
            </strong>
            . Your account has been upgraded and our team is already preparing
            your onboarding.
          </p>
        </motion.div>

        {/* Team connection banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-8 bg-gradient-to-br from-[#0B2447] to-[#19376D] rounded-3xl p-6 text-white text-left shadow-xl relative overflow-hidden"
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/15 rounded-2xl shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">
                Our team will connect with you shortly
              </h3>
              <p className="text-blue-200 text-sm leading-relaxed">
                A dedicated account manager will reach out within{" "}
                <strong className="text-white">24–48 hours</strong> to begin
                your onboarding and plan your first campaign cycle.
              </p>
            </div>
          </div>
        </motion.div>

        {/* WhatsApp help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-4 bg-white rounded-3xl border border-slate-200 shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-[#25D366]/10 rounded-xl">
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-[#0B2447] text-sm">
                Need help or have questions?
              </h4>
              <p className="text-xs text-slate-500">
                WhatsApp us anytime — we respond fast.
              </p>
            </div>
          </div>
          <Button
            onClick={openWhatsApp}
            className="w-full h-12 rounded-2xl bg-[#25D366] hover:bg-[#20B858] text-white font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5" />
            Chat on WhatsApp · 0334-4444503
          </Button>
        </motion.div>

        {/* Next steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-6 text-left space-y-3"
        >
          <h3 className="font-bold text-[#0B2447] text-base px-1">
            What happens next
          </h3>
          {NEXT_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-4 flex items-start gap-4 shadow-sm"
              >
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${step.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0B2447]">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="mt-8 flex flex-col sm:flex-row gap-3"
        >
          <Link href="/marketplace/dashboard" className="flex-1">
            <Button className="w-full h-12 rounded-2xl bg-[#19376D] hover:bg-[#0B3A5B] text-white font-semibold flex items-center justify-center gap-2 cursor-pointer">
              Go to Marketplace
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/networking" className="flex-1">
            <Button
              variant="outline"
              className="w-full h-12 rounded-2xl border-slate-200 font-semibold text-[#0B2447] cursor-pointer"
            >
              Go to Networking
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
