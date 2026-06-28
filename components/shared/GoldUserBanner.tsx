"use client";

import { Crown, MessageCircle, Calendar, Sparkles, ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/app/redux/hooks";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Link from "next/link";

const WHATSAPP_NUMBER = "923344444503";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi! I need assistance with my Throttle Connect Gold Plan subscription.",
);

function getDaysRemaining(subscriptionEnd: string | null | undefined): number | null {
  if (!subscriptionEnd) return null;
  const end = new Date(subscriptionEnd);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getProgressPercent(start: string | null | undefined, end: string | null | undefined): number {
  if (!start || !end) return 50;
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const now = Date.now();
  const total = e - s;
  const elapsed = now - s;
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
}

export default function GoldUserBanner() {
  const user = useAppSelector((s) => s.auth.user);
  const [recentPayment, setRecentPayment] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Check if subscription plan is gold and status is active
  const isGoldActive =
    user?.subscriptionPlan === "gold"  
    console.log('user?.subscriptionPlan', user?.subscriptionPlan)
console.log('isGoldActive => ',isGoldActive);

  useEffect(() => {
    if (!user?.userId) return;
    getDoc(doc(db, "users", user.userId)).then((snap) => {
      if (snap.exists() && snap.data()?.recentPayment) {
        setRecentPayment(true);
      }
    });
  }, [user?.userId]);

  const dismissTeamBanner = async () => {
    setDismissed(true);
    if (user?.userId) {
      await updateDoc(doc(db, "users", user.userId), { recentPayment: false });
    }
  };

  if (!isGoldActive) return null;

  const daysLeft = getDaysRemaining(user?.subscriptionEnd);
  const progress = getProgressPercent(user?.subscriptionStart, user?.subscriptionEnd);
  const openWhatsApp = () =>
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`, "_blank");

  return (
    <div className="space-y-4 mb-6">
      {/* Gold status card */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-amber-500/0 border border-amber-500/20 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-start sm:items-center gap-4 relative z-10">
          <div className="p-3 bg-amber-500 text-white rounded-2xl shrink-0 shadow-lg shadow-amber-500/25">
            <Crown className="w-6 h-6 animate-bounce" style={{ animationDuration: '3s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-amber-900 text-base flex items-center gap-1">
                Gold Membership
              </span>
              <span className="text-[10px] font-extrabold bg-emerald-500 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm animate-pulse">
                Active
              </span>
            </div>
            {daysLeft !== null ? (
              <div className="mt-2">
                <div className="flex items-center gap-2 text-xs text-amber-800 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    <strong>{daysLeft} days</strong> remaining in your cycle (4 months total)
                  </span>
                </div>
                <div className="mt-2 w-full sm:w-64 h-2 bg-amber-200/50 rounded-full overflow-hidden border border-amber-300/30">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-550 to-yellow-500 rounded-full transition-all"
                    style={{ width: `${100 - progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-amber-800 font-medium mt-1">
                Your premium Gold plan is active. Enjoy exclusive leads and high visibility!
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 relative z-10 w-full sm:w-auto justify-end">
          <Link href="/checkout/success">
            <Button
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold gap-1.5 cursor-pointer shadow-md shadow-amber-600/10"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Success Benefits
            </Button>
          </Link>
          <Button
            onClick={openWhatsApp}
            size="sm"
            variant="outline"
            className="bg-white hover:bg-slate-50 border-slate-200 text-slate-750 text-slate-700 rounded-xl text-xs font-semibold gap-1.5 cursor-pointer shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366] fill-[#25D366]" />
            Support
          </Button>
        </div>
      </div>

      {/* Team connecting banner (shown once after payment) */}
      {recentPayment && !dismissed && (
        <div className="rounded-2xl bg-gradient-to-r from-[#0B2447] to-[#19376D] text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-white/15 rounded-xl shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
                Our team will connect with you shortly!
              </h4>
              <p className="text-blue-200 text-xs leading-relaxed mt-0.5">
                Your account manager will reach out within 24–48 hours. Need
                immediate help? Chat on WhatsApp.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={openWhatsApp}
              size="sm"
              className="bg-[#25D366] hover:bg-[#20B858] text-white rounded-xl text-xs font-semibold gap-1.5 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Chat Now
            </Button>
            <Button
              onClick={dismissTeamBanner}
              size="sm"
              variant="ghost"
              className="text-blue-200 hover:text-white hover:bg-white/10 rounded-xl text-xs cursor-pointer"
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
